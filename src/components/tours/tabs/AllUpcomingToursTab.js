// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Modal,
  Tab,
} from 'semantic-ui-react'
import TourCard from '../cards/TourCard'
import TourPopup from '../components/TourPopup'

class AllUpcomingToursTab extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  getBuildingObj(building_id) {
    return this.props.buildings.filter((building) => {
      return building.building_id === building_id
    })[0]
  }

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context: context
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'open_tour') {
      return this.renderTourPopup(context)
    }
    return null
  }

  renderTourPopup(tour) {
    return (
      <Modal
        dimmer
        open={this.state.toggle_modal}
        onClose={() => this.toggleModal(false)}
        closeIcon
        size='small'
      >
      <Modal.Content>
        <TourPopup
          tour={tour}
          refresh={() => this.refreshTours()}
          closeModal={() => this.toggleModal(false)}
          type='tours'
        />
      </Modal.Content>
    </Modal>
    )
  }

	render() {
		return (
			<div id='AllUpcomingToursTab' style={comStyles().container}>
        <div style={comStyles().toursContainer} >
          {
            this.props.tours.map((tour) => {
              const building = this.getBuildingObj(tour.building_id)
              return (
                <TourCard
                  key={tour.tour_id}
                  tour={tour}
                  building={building}
                  openPopup={(e) => this.toggleModal(true, 'open_tour', e)}
                />
              )
            })
          }
        </div>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
AllUpcomingToursTab.propTypes = {
	history: PropTypes.object.isRequired,
  buildings: PropTypes.array.isRequired,  // passed in
  tours: PropTypes.array.isRequired,      // passed in
}

// for all optional props, define a default value
AllUpcomingToursTab.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(AllUpcomingToursTab)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {

	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    toursContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxHeight: '100%',
      width: '100%',
      overflowY: 'scroll',
      padding: '10px',
      justifyContent: 'flex-start',
    }
	}
}

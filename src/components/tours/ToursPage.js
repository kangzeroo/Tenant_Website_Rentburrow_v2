// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Modal,
  Header,
} from 'semantic-ui-react'
import { getAllAvailableTours, } from '../../api/tour/tour_api'
import TourCard from './cards/TourCard'
import TourPopup from './components/TourPopup'

class ToursPage extends Component {

  constructor() {
    super()
    this.state = {
      tours: [],

      toggle_modal: false,
      modal_name: '',
      context: null,
    }
  }

  componentWillMount() {
    getAllAvailableTours()
    .then((data) => {
      this.setState({
        tours: data,
      })
    })
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
        size='large'
      >
      <Modal.Content>
        <TourPopup
          tour={tour}
          refresh={() => this.refreshTours()}
          closeModal={() => this.toggleModal(false)}
        />
      </Modal.Content>
    </Modal>
    )
  }


	render() {
		return (
			<div id='ToursPage' style={comStyles().container}>
        <Header as='h2' content='Upcoming Tours' subheader='You can join an upcoming tour' />
        <div style={comStyles().toursContainer} >
          {
            this.state.tours.map((tour) => {
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
ToursPage.propTypes = {
	history: PropTypes.object.isRequired,
  buildings: PropTypes.array.isRequired,
}

// for all optional props, define a default value
ToursPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ToursPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    buildings: redux.search.buildings,
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
      margin: '20px',
      minHeight: '93vh'
		},
    toursContainer: {
      display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			maxHeight: '100%',
			width: '100%',
			overflowY: 'scroll',
			padding: '15px',
			justifyContent: 'flex-start',
    }
	}
}

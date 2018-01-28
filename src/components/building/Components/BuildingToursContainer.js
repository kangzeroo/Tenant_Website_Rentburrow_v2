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
import BuildingTourCard from '../../tours/cards/BuildingTourCard'
import TourPopup from '../../tours/components/TourPopup'

class BuildingToursContainer extends Component {

  constructor() {
    super()
    this.state = {
      toggle_modal: false,
      modal_name: '',
      context: null,
    }
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
          type='building'
        />
      </Modal.Content>
    </Modal>
    )
  }

	render() {
		return (
			<Card className='pretty_scrollbar' raised id='BuildingToursContainer' style={comStyles().container}>
        <Header as='h2' icon='checked calendar' content={`${this.props.tours.length} Upcoming Tours`} />
        <div style={comStyles().toursContainer} >
  				{
            this.props.tours.map((tour) => {
              return (
                <div key={tour.tour_id} >
                  <BuildingTourCard
                    key={tour.tour_id}
                    tour={tour}
                    building={this.props.building}
                    openPopup={(context) => this.toggleModal(true, 'open_tour', context)}
                  />
                </div>
              )
            })
          }
        </div>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</Card>
		)
	}
}

// defines the types of variables in this.props
BuildingToursContainer.propTypes = {
	history: PropTypes.object.isRequired,
  tours: PropTypes.array.isRequired,          // passed in
  building: PropTypes.object.isRequired,    // passed in
}

// for all optional props, define a default value
BuildingToursContainer.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(BuildingToursContainer)

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
      padding: '20px',
      minWidth: '100%',
      maxWidth: '100%',
      overflowX: 'scroll',
		},
    toursContainer: {
      display: 'flex',
      flexDirection: 'row',
      minWidth: '100%',
      maxWidth: '100%',
		}
	}
}

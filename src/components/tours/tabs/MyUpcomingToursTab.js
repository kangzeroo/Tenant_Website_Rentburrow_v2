// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Segment,
	Dimmer,
	Loader,
	Message,
} from 'semantic-ui-react'
import { getTenantGroupTour, } from '../../../api/tour/tour_api'
import MyTourCard from '../cards/MyTourCard'


class MyUpcomingToursTab extends Component {

	constructor() {
		super()
		this.state = {
			tours: [],

			tours_loaded: false,
			no_tours: false,
		}
	}

	componentWillMount() {
		getTenantGroupTour(JSON.stringify([this.props.tenant_profile.tenant_id]))
		.then((data) => {
			if (data && data.length > 0) {
				this.setState({
					tours: data,
					tours_loaded: true,
				})
			} else {
				this.setState({
					tours_loaded: true,
					no_tours: true,
				})
			}
		})
	}

	getBuildingObj(building_id) {
		return this.props.buildings.filter((building) => {
			return building.building_id === building_id
		})[0]
	}

	renderNoTours() {
		return (
			<Message warning>
		    <Message.Header>{`You don't have any upcoming tours`}</Message.Header>
		    <p>{`Message some properties and set up a tour, or join a tour`}</p>
		  </Message>
		)
	}

	renderTours() {
		return (
			<div>
				{
					this.state.tours.map((tour) => {
						const building = this.getBuildingObj(tour.building_id)
						return (
							<MyTourCard
								key={tour.tour_id}
								tour={tour}
								building={building}
							/>
						)
					})
				}
			</div>
		)
	}

	render() {
		return (
			<div id='MyUpcomingToursTab' style={comStyles().container}>
				{
					this.state.no_tours
					?
					this.renderNoTours()
					:
					<div>
						{
							this.state.tours_loaded
							?
							this.renderTours()
							:
							<Segment style={comStyles().loadingContainer}>
					      <Dimmer active inverted>
					        <Loader inverted content='Loading' />
					      </Dimmer>
					    </Segment>
						}
					</div>
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
MyUpcomingToursTab.propTypes = {
	history: PropTypes.object.isRequired,
	tenant_profile: PropTypes.object.isRequired,
	buildings: PropTypes.array.isRequired,  // passed in
}

// for all optional props, define a default value
MyUpcomingToursTab.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MyUpcomingToursTab)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		tenant_profile: redux.auth.tenant_profile,
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
		loadingContainer: {
			width: '100%',
			minHeight: '300px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',

		}
	}
}

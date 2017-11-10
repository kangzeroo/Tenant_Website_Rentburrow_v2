// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
	withRouter,
} from 'react-router-dom'
import {
	Card,
	Icon,
} from 'semantic-ui-react'
import {
  xMidBlue,
  xDeepBlue,
	xLightBlue,
} from '../../../styles/base_colors'
import PromoCard from './promos/PromoCard'
import EventCard from './events/EventCard'
import LocalsView from './LocalsView'
import MapComponent from '../../map/MapComponent'


class CommunityPage extends Component {

	render() {
		return (
			<div style={comStyles().container}>

				<div style={comStyles().community}>
					{
						this.props.selected_local
						?
						<LocalsView selected_local={this.props.selected_local} style={comStyles().community} />
						:
						<div style={comStyles().community_set}>
							<div style={comStyles().list}>
								<div style={comStyles().scrollbox}>
										<Card onClick={() => this.props.history.push('/housing')} fluid style={comStyles().leases}>
											Housing Must Knows
										</Card>
								</div>
							</div>

							<div style={comStyles().list}>
								<div style={comStyles().label}>What to look for</div>
								<div style={comStyles().scrollbox}>
									{
										this.props.latest_promos.map((promo) => {
											return (
												<PromoCard
													key={promo.promo_id}
													promo={promo}
												/>)
										})
									}
								</div>
							</div>

							<div style={comStyles().list}>
								<div style={comStyles().label}>Tenant Rights</div>
								<div style={comStyles().scrollbox}>
									{
										this.props.latest_events.map((event) => {
											return (
												<EventCard
													key={event.event_id}
													event={event}
												/>)
										})
									}
								</div>
							</div>
						</div>
					}
				</div>

				<div style={comStyles().housing}>
					<MapComponent listOfResults={
						this.props.selected_local
						?
						[this.props.selected_local]
						:
						this.props.latest_promos.concat(this.props.latest_events)
					} />
				</div>

			</div>
		)
	}
}

// defines the types of variables in this.props
CommunityPage.propTypes = {
	history: PropTypes.object.isRequired,
	latest_promos: PropTypes.array.isRequired,
	latest_events: PropTypes.array.isRequired,
	selected_local: PropTypes.object,
}

// for all optional props, define a default value
CommunityPage.defaultProps = {
	selected_local: null,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(CommunityPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		latest_promos: redux.community.latest_promos,
		latest_events: redux.community.latest_events,
		selected_local: redux.community.selected_local,
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
      flexDirection: 'row',
			height: '93vh'
		},
		community: {
			width: '60vw',
			height: '100%',
			overflowX: 'hidden',
			overflowY: 'scroll',
			backgroundImage: `url('https://www.xmple.com/wallpaper/gradient-blue-white-linear-1920x1080-c2-ffffff-87ceeb-a-0-f-14.svg')`,
			backgroundSize: 'cover',
		},
		community_set: {

		},
		housing: {
			width: '40vw',
			height: '100%',
		},
		list: {
			padding: '10px',
			display: 'flex',
			flexDirection: 'column',
		},
		label: {
			fontSize: '2rem',
			fontWeight: 'bold',
			padding: '20px',
			color: 'white',
		},
		scrollbox: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignContent: 'flex-start',
			overflowX: 'scroll',
		},
		leases: {
			padding: '20px',
			fontSize: '3rem',
			fontWeight: 'bold',
			display: 'flex',
			justifyContent: 'center',
			alignContent: 'center',
			cursor: 'pointer',
			maxHeight: '150px',
			minHeight: '150px',
			margin: '5px auto',
			textAlign: 'center',
			backgroundColor: xMidBlue,
			color: 'white',
			border: '0px solid white',
		},
		sublets: {
			padding: '20px',
			fontSize: '3rem',
			fontWeight: 'bold',
			display: 'flex',
			justifyContent: 'center',
			alignContent: 'center',
			cursor: 'pointer',
			maxHeight: '150px',
			minHeight: '150px',
			margin: '5px auto',
			textAlign: 'center',
			backgroundColor: xMidBlue,
			color: 'white',
			border: '0px solid white',
		}
	}
}

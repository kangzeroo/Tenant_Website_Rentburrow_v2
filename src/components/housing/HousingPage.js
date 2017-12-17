// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'
import HousingPanel from './panel/HousingPanel'
import MapComponent from '../map/MapComponent'
import {
	queryBuildingsInArea,
} from '../../api/search/search_api'
import {
	saveBuildingsToRedux,
	saveSubletsToRedux,
} from '../../actions/search/search_actions'
import PopupPanel from './panel/PopupPanel'
import {
	querySubletsInArea,
} from '../../api/search/sublet_api'
import { selectHelpThread } from '../../actions/messaging/messaging_actions'

class HousingPage extends Component {

	constructor() {
		super()
		this.state = {
			buildings: [],
		}
	}

	componentWillMount() {
		this.refreshBuildings()
		this.props.selectHelpThread()
	}

	/* {
		...this.props.current_gps_center,
		filterParams: this.props.lease_filter_params,
	}*/

	refreshBuildings() {
		queryBuildingsInArea()
		.then((data) => {
			const buildings = data
			// Sort the buildings randomly
			this.props.saveBuildingsToRedux(buildings.sort((a, b) => { return 0.5 - Math.random() }))
			this.setState({
				buildings,
			})
			return querySubletsInArea({
				...this.props.current_gps_center,
				filterParams: this.props.sublet_filter_params,
			})
		})
		.then((data) => {
			this.props.saveSubletsToRedux(data)
		})
	}

	render() {
		return (
			<div id='HousingPage' style={comStyles().container}>
				{
					this.props.popup_buildings.length > 0
					?
					<PopupPanel
						buildings={this.props.popup_buildings}
						style={comStyles().popupPanel}
					/>
					:
					null
				}
				<HousingPanel
					refresh={() => this.refreshBuildings()}
					buildings={this.state.buildings}
				/>
				<MapComponent
					listOfResults={
						this.props.rent_type === 'sublet'
						?
						this.props.sublet_search_results
						:
						this.props.building_search_results
					}
					selected_pin={this.props.selected_pin}
					style={comStyles().map}
				/>
				<div style={comStyles().beta_tag_container}>
					<img style={comStyles().beta_tag} src='https://s3.amazonaws.com/rentburrow-static-assets/Images/beta_tag.png' alt='logo' />
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
HousingPage.propTypes = {
	history: PropTypes.object.isRequired,
	saveBuildingsToRedux: PropTypes.func.isRequired,
	building_search_results: PropTypes.array,
	sublet_search_results: PropTypes.array,
	selected_pin: PropTypes.string,
	popup_buildings: PropTypes.array,
	rent_type: PropTypes.string.isRequired,
	current_gps_center: PropTypes.object.isRequired,
  lease_filter_params: PropTypes.object.isRequired,
  sublet_filter_params: PropTypes.object.isRequired,
	saveSubletsToRedux: PropTypes.func.isRequired,
  selectHelpThread: PropTypes.func.isRequired,
}

// for all optional props, define a default value
HousingPage.defaultProps = {
	building_search_results: [],
	sublet_search_results: [],
	selected_pin: null,
	popup_buildings: [],
  search_radius: 1000,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HousingPage)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		building_search_results: redux.search.building_search_results,
		sublet_search_results: redux.search.sublet_search_results,
		selected_pin: redux.search.selected_pin,
		popup_buildings: redux.search.popup_buildings,
		rent_type: redux.filter.rent_type,
		current_gps_center: redux.filter.current_gps_center,
    lease_filter_params: redux.filter.lease_filter_params,
    sublet_filter_params: redux.filter.sublet_filter_params,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveBuildingsToRedux,
		saveSubletsToRedux,
    selectHelpThread,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'row',
			height: '93vh',
			width: '100%',
			position: 'relative',
		},
		map: {
			width: '100vw',
		},
		popupPanel: {
			position: 'absolute',
			zIndex: 100,
			left: 0,
		},
		beta_tag_container: {
			position: 'absolute',
			right: '0px',
			top: '0px',
		},
		beta_tag: {
			width: '120px',
			height: '120px',
		},
	}
}

// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import InputRange from 'react-input-range'
import {
	Checkbox,
	Button,
	Card,
} from 'semantic-ui-react'
import { STUDENT_PREFERENCES } from '../../api/intel/dynamodb_tablenames'
import { collectIntel } from '../../actions/intel/intel_actions'
import { queryBuildingsInArea } from '../../api/search/search_api'
import { saveBuildingsToRedux, saveLeaseFilterParams, saveFilteredBuildingsToRedux, toggleHideSoldOuts } from '../../actions/search/search_actions'
require('../../styles/react-input-range.css')

class LeaseFilterCard extends Component {

	constructor() {
		super()
		this.state = {
			price: {
				min: 500,
				max: 900,
			},
			room_count: 0,
			ensuite_bath: false,
			utils_incl: false,
			parking_avail: false,
			search_radius: 1000,
		}
	}

	componentWillMount() {
		this.setState({
			...this.props.lease_filter_params,
		})
	}

	updateAttr(attr, value) {
		this.setState({
			[attr]: value
		})
	}

	applyFilters() {
		let filtered = this.props.buildings

		// If pricing filters have changed...
		if (this.state.price.min !== 500 || this.state.price.max !== 900) {
			filtered = filtered.filter((building) => {
				return building.min_price >= this.state.price.min && building.min_price <= this.state.price.max
			})
		}

		// if the number of rooms filter has changed...
		if (this.state.room_count !== 0) {
			filtered = filtered.filter((building) => {
				return parseInt(building.max_rooms, 10) >= this.state.room_count && parseInt(building.min_rooms, 10) <= this.state.room_count
			})
		}

		// if ensuite_bath is true
		if (this.state.ensuite_bath) {
			filtered = filtered.filter((building) => {
				return building.ensuite_bath
			})
		}

		// if utilities_included is true
		if (this.state.utils_incl) {
			filtered = filtered.filter((building) => {
				return building.utils_incl ? true : false
			})
		}

		this.props.saveFilteredBuildingsToRedux(filtered)
		this.props.saveLeaseFilterParams(this.state)
		this.props.closeFilterCard()
		this.props.collectIntel({
		  'TableName': STUDENT_PREFERENCES,
		  'Item': {
		    'ACTION': 'LEASE_FILTER_PARAMS',
		    'DATE': new Date().getTime(),
		    'USER_ID': this.props.tenant_profile.tenant_id || 'NONE',
				'PARAMS': JSON.stringify(this.state),
		    'FINGERPRINT': this.props.fingerprint,
		  }
		})
	}

	render() {
		return (
			<Card id='LeaseFilterCard' raised fluid style={comStyles().container}>
				<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Price</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={5}
							maxValue={1200}
							minValue={300}
							formatLabel={(value) => `$${value >= 1200 ? '1200+' : value}`}
							value={this.state.price}
							onChange={(value) => this.updateAttr('price', value)}
							onChangeComplete={value => console.log()}
						/>
					</div>
				</div>
				<div style={comStyles().roomCountBox}>
					<div style={comStyles().label}>
						<h2>Bedrooms</h2>
					</div>
					<div style={comStyles().room_count}>
						<Button
							circular
							primary
							basic
							icon='minus'
							onClick={() => this.updateAttr('room_count', this.state.room_count - 1)}
							disabled={this.state.room_count === 0}
						/>
						<div style={comStyles().room_text} >
							{ this.state.room_count === 0 ? 'All Bedrooms' : `${this.state.room_count} Bedroom${this.state.room_count === 1 ? '' : 's'}`}
						</div>
						<Button
							circular
							primary
							basic
							icon='plus'
							onClick={() => this.updateAttr('room_count', this.state.room_count + 1)}
							disabled={this.state.room_count >= 10}
						/>
					</div>
				</div>
				<div style={comStyles().main_amenities}>
					<Checkbox
						label='Ensuite Bath'
						checked={this.state.ensuite_bath}
						onChange={(e, x) => this.updateAttr('ensuite_bath', x.checked)}
						toggle />
					<Checkbox
						label='Hide Sold Outs'
						checked={this.props.hide_sold_outs}
						onChange={() => this.props.toggleHideSoldOuts(!this.props.hide_sold_outs)}
						toggle />
				</div>
				<div style={comStyles().buttons_container}>
					<Button
						primary
						basic
						content='Cancel'
						onClick={() => this.props.closeFilterCard()}
					/>
					<Button
						primary
						content='Search'
						onClick={() => this.applyFilters()}
					/>
					{/*<Button positive basic content='More options...' />*/}
				</div>
			</Card>
		)
	}
}

// defines the types of variables in this.props
LeaseFilterCard.propTypes = {
	history: PropTypes.object.isRequired,
	saveBuildingsToRedux: PropTypes.func.isRequired,
	closeFilterCard: PropTypes.func.isRequired,
	saveLeaseFilterParams: PropTypes.func.isRequired,
	lease_filter_params: PropTypes.object.isRequired,
	current_gps_center: PropTypes.object.isRequired,
	building_search_results: PropTypes.array.isRequired,
	buildings: PropTypes.array.isRequired,
	saveFilteredBuildingsToRedux: PropTypes.func.isRequired,
	toggleHideSoldOuts: PropTypes.func.isRequired,
	hide_sold_outs: PropTypes.bool,
  collectIntel: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  fingerprint: PropTypes.string.isRequired,
}

// for all optional props, define a default value
LeaseFilterCard.defaultProps = {
	hide_sold_outs: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LeaseFilterCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		lease_filter_params: redux.filter.lease_filter_params,
		current_gps_center: redux.filter.current_gps_center,
		building_search_results: redux.search.building_search_results,
		buildings: redux.search.buildings,
		hide_sold_outs: redux.search.hide_sold_outs,
    tenant_profile: redux.auth.tenant_profile,
    fingerprint: redux.auth.browser_fingerprint,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveBuildingsToRedux,
		saveLeaseFilterParams,
		saveFilteredBuildingsToRedux,
		toggleHideSoldOuts,
    collectIntel,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '260px',
			maxHeight: '260px',
			padding: '30px 30px 10px 30px',
			zIndex: '9999',
			backgroundColor: 'white',
			borderRadius: '3px'
		},
		close_button: {
			position: 'absolute',
			top: '15px',
			left: '15px',
		},
		sliderBox: {
			padding: '10px',
			width: '100%',
			height: '50px',
			display: 'flex',
			flexDirection: 'row',
		},
		label: {
			width: '30%',
		},
		slider: {
			width: '70%',
		},
		main_amenities: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			padding: '30px',
			height: 'auto',
		},
		buttons_container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		roomCountBox: {
			padding: '20px 10px 20px 10px',
			minWidth: '250px',
			maxWidth: '100%',
			height: '75px',
			display: 'flex',
			flexDirection: 'center',
		},
		room_count: {
			display: 'flex',
			flexDirection: 'row',
			minWidth: '300px',
			maxWidth: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			margin: '0px 100px 0px 100px',
		},
		room_text: {
			fontSize: 'x-large'
		}
	}
}

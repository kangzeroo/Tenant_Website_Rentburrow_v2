// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { queryBuildingsInArea } from '../../../../api/search/search_api'
import { saveBuildingsToRedux, saveLeaseFilterParams, saveFilteredBuildingsToRedux, toggleHideSoldOuts } from '../../../../actions/search/search_actions'
import {
	Checkbox,
	Button,
	Card,
} from 'semantic-ui-react'
import InputRange from 'react-input-range'
require('../../../../styles/react-input-range.css')


class MobileLeaseFilterCard extends Component {

	constructor() {
		super()
		this.state = {
			price: {
				min: 500,
				max: 900,
			},
			room_count: 1,
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
		// this.props.saveLeaseFilterParams(this.state)
		// queryBuildingsInArea({
		// 	...this.props.current_gps_center,
		// 	filterParams: this.state,
		// }).then((buildings) => {
		// 	this.props.saveBuildingsToRedux(buildings)
		// 	this.props.closeFilterCard()
		// })
		let filtered = this.props.buildings

		// If pricing filters have changed...
		if (this.state.price.min !== 500 || this.state.price.max !== 900) {
			filtered = filtered.filter((building) => {
				return building.min_price >= this.state.price.min && building.min_price <= this.state.price.max
			})
		}

		// if the number of rooms filter has changed...
		if (this.state.room_count > 1) {
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
	}

/*
	renderRoomFilter() {
		return (
			<InputRange
				step={1}
				maxValue={10}
				minValue={1}
				formatLabel={(value) => `${value} bed${value > 1 ? 's' : ''}`}
				value={this.state.bedrooms}
				onChange={(value) => this.updateAttr('bedrooms', value)}
				onChangeComplete={value => console.log(value)}
			/>
		)
	}*/

	render() {
		return (
			<Card id='MobileLeaseFilterCard' raised fluid style={comStyles().container}>
				<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						Price
					</div>
          <br/><br/>
					<div style={comStyles().label}>
						${this.state.price.min} to ${this.state.price.max}
					</div>
					<div style={comStyles().slider}>
						<InputRange
              ariaControls
							step={5}
		          maxValue={1200}
		          minValue={300}
		          formatLabel={(value) => `$${value >= 1200 ? '1200+' : value}`}
		          value={this.state.price}
		          onChange={(value) => this.updateAttr('price', value)}
		          onChangeComplete={value => console.log()}
              size='massive'
						/>
					</div>
				</div>
				<div style={comStyles().roomCountBox}>
					<div style={comStyles().room_count}>
						<Button
							circular
							primary
              size='massive'
							basic
							icon='minus'
							onClick={() => this.updateAttr('room_count', this.state.room_count - 1)}
							disabled={this.state.room_count <= 1}
						/>
						<div style={comStyles().room_text} >
							{this.state.room_count} Rooms
						</div>
						<Button
							circular
							primary
              size='massive'
							basic
							icon='plus'
							onClick={() => this.updateAttr('room_count', this.state.room_count + 1)}
							disabled={this.state.room_count >= 10}
						/>
					</div>
				</div>
				{/*<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Bedrooms</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={1}
		          maxValue={6}
		          minValue={1}
		          formatLabel={(value) => `${value >= 6 ? '5+' : value}`}
		          value={this.state.room_count}
		          onChange={(value) => this.updateAttr('room_count', value)}
		          onChangeComplete={value => console.log()}
						/>
					</div>
				</div>*/}
				{/*<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Lease Length</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={4}
		          maxValue={16}
		          minValue={0}
		          formatLabel={(value) => `${value} months`}
		          value={this.state.lease_length}
		          onChange={(value) => this.updateAttr('lease_length', value)}
		          onChangeComplete={value => console.log(value)}
						/>
					</div>
				</div>*/}
        <br/><br/>
				<div style={comStyles().main_amenities}>
					<Checkbox
						label='Ensuite Bath'
						checked={this.state.ensuite_bath}
						onChange={(e, x) => this.updateAttr('ensuite_bath', x.checked)}
						toggle
            style={comStyles().checkbox}
          />
          <br />
          <br />
					{/*}<Checkbox
						label='Utilities Included'
						checked={this.state.utils_incl}
						onChange={(e, x) => this.updateAttr('utils_incl', x.checked)}
						toggle />*/}
					<Checkbox
						label='Hide Sold Outs'
						checked={this.props.hide_sold_outs}
						onChange={() => this.props.toggleHideSoldOuts(!this.props.hide_sold_outs)}
						toggle
            style={comStyles().checkbox}
          />
					{/*
					<Checkbox
						label='Parking Available'
						checked={this.state.parking_avail}
						onChange={(e, x) => this.updateAttr('parking_avail', x.checked)}
						toggle />*/}
				</div>
				<div style={comStyles().buttons_container}>
					<Button
            fluid
						primary
						content='Search'
						onClick={() => this.applyFilters()}
            size='massive'
					/>
					{/*<Button positive basic content='More options...' />*/}
				</div>
			</Card>
		)
	}
}

// defines the types of variables in this.props
MobileLeaseFilterCard.propTypes = {
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
}

// for all optional props, define a default value
MobileLeaseFilterCard.defaultProps = {
	hide_sold_outs: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MobileLeaseFilterCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		lease_filter_params: redux.filter.lease_filter_params,
		current_gps_center: redux.filter.current_gps_center,
		building_search_results: redux.search.building_search_results,
		buildings: redux.search.buildings,
		hide_sold_outs: redux.search.hide_sold_outs,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveBuildingsToRedux,
		saveLeaseFilterParams,
		saveFilteredBuildingsToRedux,
		toggleHideSoldOuts,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			height: 'auto',
			padding: '50px',
			backgroundColor: 'white',
		},
		close_button: {
			position: 'absolute',
			top: '15px',
			left: '15px',
		},
		sliderBox: {
			padding: '10px',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
		},
		label: {
			width: '100%',
      fontSize: '3rem',
      textAlign: 'center',
      padding: '10px',
		},
		slider: {
			width: '100%',
      fontSize: '3rem',
      padding: '50px 0px 50px 0px'
		},
		main_amenities: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: '50px',
			height: '200px',
      width: '50vw',
      margin: 'auto',
		},
		buttons_container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
      padding: '30px',
		},
		roomCountBox: {
			padding: '20px 0px 30px 0px',
			width: '100%',
			height: 'auto',
			display: 'flex',
			flexDirection: 'column',
		},
		room_count: {
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			justifyContent: 'space-around',
			alignItems: 'center',
			margin: '10px 0px 0px 0px',
		},
		room_text: {
			fontSize: '3rem'
		},
    checkbox: {
      fontSize: '3rem',
    }
	}
}

// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import { } from '../../api/search/sublet_api'
import {
	saveSubletsToRedux,
	saveSubletFilterParams,
	saveFilteredSubletsToRedux,
} from '../../actions/search/search_actions'
import {
	Checkbox,
	Button,
	Card,
} from 'semantic-ui-react'
import InputRange from 'react-input-range'
require('../../styles/react-input-range.css')


class SubletFilterCard extends Component {

	constructor() {
		super()
		this.state = {
			price: {
				min: 500,
				max: 900,
			},
			room_count: 1,
			ensuite_bath: false,
			female_only: false,
      utils_incl: false,
		}
	}

	componentWillMount() {
		this.setState({
			...this.props.sublet_filter_params,
		})
	}

	updateAttr(attr, value) {
		// console.log(value)
		this.setState({
			[attr]: value
		})
	}

	applyFilters() {
		// this.props.saveSubletFilterParams(this.state)
		// filterFBPosts(this.state).then((sublets) => {
		// 	this.props.saveSubletsToRedux(sublets.map(s => JSON.parse(s)))
		// 	this.props.closeFilterCard()
		// })

		this.props.saveSubletFilterParams(this.state)

		let filtered = this.props.sublets

		// If pricing filters have changed...
		if (this.state.price.min !== 500 || this.state.price.max !== 900) {
			filtered = filtered.filter((building) => {
				return building.price >= this.state.price.min && building.price <= this.state.price.max
			})
		}

		// if the number of rooms filter has changed...
		if (this.state.room_count > 1) {
			filtered = filtered.filter((building) => {
				return building.rooms_left >= this.state.room_count
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
				return building.utils_included
			})
		}

		// if female onlys is true
		if (this.state.female_only) {
			filtered = filtered.filter((building) => {
				return building.female_only
			})
		}

		this.props.saveFilteredSubletsToRedux(filtered)
		this.props.closeFilterCard()
	}

	render() {
		return (
			<Card id='SubletFilterCard' raised fluid style={comStyles().container}>
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
		          onChangeComplete={value => console.log(value)}
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
							{this.state.room_count}+
						</div>
						<Button
							circular
							primary
							basic
							icon='plus'
							onClick={() => this.updateAttr('room_count', this.state.room_count + 1)}
							disabled={this.state.room_count === 10}
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
						label='Utilities Included'
						checked={this.state.utils_incl}
						onChange={(e, x) => this.updateAttr('utils_incl', x.checked)}
						toggle />
					<Checkbox
						label='Female Only'
						checked={this.state.female_only}
						onChange={(e, x) => this.updateAttr('female_only', x.checked)}
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
SubletFilterCard.propTypes = {
	history: PropTypes.object.isRequired,
	saveSubletsToRedux: PropTypes.func.isRequired,
	closeFilterCard: PropTypes.func.isRequired,
	saveSubletFilterParams: PropTypes.func.isRequired,
	sublet_filter_params: PropTypes.object.isRequired,
	sublet_search_results: PropTypes.array.isRequired,
	sublets: PropTypes.array.isRequired,
	saveFilteredSubletsToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
SubletFilterCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SubletFilterCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
		sublet_filter_params: redux.filter.sublet_filter_params,
		sublet_search_results: redux.search.sublet_search_results,
		sublets: redux.search.sublets,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
		saveSubletsToRedux,
		saveSubletFilterParams,
		saveFilteredSubletsToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
			minHeight: '300px',
			maxHeight: '300px',
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
			height: '50px',
		},
		roomCountBox: {
			padding: '20px 10px 20px 10px',
			width: '100%',
			height: '75px',
			display: 'flex',
			flexDirection: 'row',
		},
		room_count: {
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			justifyContent: 'space-around',
			alignItems: 'center',
			margin: '0px 200px 0px 200px',
		},
		room_text: {
			fontSize: 'x-large'
		}
	}
}

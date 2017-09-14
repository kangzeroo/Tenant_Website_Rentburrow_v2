// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Checkbox,
	Button,
} from 'semantic-ui-react'
import InputRange from 'react-input-range'
require('../../styles/react-input-range.css')


class FilterCard extends Component {

	constructor() {
		super()
		this.state = {
			price: {
				min: 500,
				max: 900,
			},
			bedrooms: {
				min: 1,
				max: 5,
			},
			lease_length: {
				min: 8,
				max: 12,
			},
			ensuite_bath: false,
			utils_incl: false,
			parking_avail: false,
		}
	}

	updateAttr(attr, value) {
		console.log(value)
		this.setState({
			[attr]: value
		})
	}

	render() {
		return (
			<div style={comStyles().container}>
				<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Price</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={5}
		          maxValue={1200}
		          minValue={300}
		          formatLabel={(value) => `$${value}`}
		          value={this.state.price}
		          onChange={(value) => this.updateAttr('price', value)}
		          onChangeComplete={value => console.log(value)}
						/>
					</div>
				</div>
				<div style={comStyles().sliderBox}>
					<div style={comStyles().label}>
						<h2>Bedrooms</h2>
					</div>
					<div style={comStyles().slider}>
						<InputRange
							step={1}
							maxValue={10}
							minValue={1}
							formatLabel={(value) => `${value} bed${value > 1 ? 's' : ''}`}
							value={this.state.bedrooms}
							onChange={(value) => this.updateAttr('bedrooms', value)}
							onChangeComplete={value => console.log(value)}
						/>
					</div>
				</div>
				<div style={comStyles().sliderBox}>
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
				</div>
				<div style={comStyles().main_amenities}>
					<Checkbox label='Ensuite Bath' checked={this.state.ensuite_bath} onChange={(e, x) => this.updateAttr('ensuite_bath', x.checked)} toggle />
					<Checkbox label='Utilities Included' checked={this.state.utils_incl} onChange={(e, x) => this.updateAttr('utils_incl', x.checked)} toggle />
					<Checkbox label='Parking Available' checked={this.state.parking_avail} onChange={(e, x) => this.updateAttr('parking_avail', x.checked)} toggle />
				</div>
				<div style={comStyles().search_buttons}>
					<Button positive fluid content='Search' />
					{/*<Button positive basic content='More options...' />*/}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
FilterCard.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
FilterCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(FilterCard)

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
			padding: '30px',
			height: '600px',
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
		search_buttons: {
			display: 'flex',
			flexDirection: 'column',
			height: '75px',
		}
	}
}

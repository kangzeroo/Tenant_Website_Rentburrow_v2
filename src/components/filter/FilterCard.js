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
		}
	}

	updateAttr(attr, e) {
		this.setState({
			[attr]: e.target.value,
		})
	}

	render() {
		return (
			<div style={comStyles().container}>
				FilterCard
				<div style={comStyles().sliderBox}>
					<InputRange
						step={5}
	          maxValue={1200}
	          minValue={300}
	          formatLabel={(value) => `$${value}`}
	          value={this.state.price}
	          onChange={(value) => this.updateAttr('price', { target: { value: value } })}
	          onChangeComplete={value => console.log(value)}
					/>
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
		},
		sliderBox: {
			padding: '10px',
			width: '200px',
			height: '50px',
		},
	}
}

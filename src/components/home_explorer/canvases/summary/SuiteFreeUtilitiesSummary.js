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


class SuiteFreeUtilitiesSummary extends Component {

	render() {
		return (
			<div style={comStyles().free_utilities_summary}>
				{
					this.props.free_utilities_summary.electric
					?
					<h3>Electricity (hydro) included</h3>
					:
					<h3>Electricity (hydro) costs seperate</h3>
				}
				{
					this.props.free_utilities_summary.water
					?
					<h3>Water included</h3>
					:
					<h3>Water costs seperate</h3>
				}
				{
					this.props.free_utilities_summary.heating
					?
					<h3>Heating included</h3>
					:
					<h3>Heating costs seperate</h3>
				}
				{
					this.props.free_utilities_summary.internet
					?
					<h3>Internet included</h3>
					:
					<h3>Interet cost seperate</h3>
				}
			</div>
		)
	}
}

// defines the types of variables in this.props
SuiteFreeUtilitiesSummary.propTypes = {
	history: PropTypes.object.isRequired,
	free_utilities_summary: PropTypes.object,
}

// for all optional props, define a default value
SuiteFreeUtilitiesSummary.defaultProps = {
	free_utilities_summary: {
		water: false,
		electric: false,
		heating: false,
		internet: false,
	}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SuiteFreeUtilitiesSummary)

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
    free_utilities_summary: {
      display: 'flex',
      flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
      height: '100%',
			padding: '30px',
    }
	}
}

// Compt for copying as a HowItWorksLandlord
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {

} from 'semantic-ui-react'


class HowItWorksLandlord extends Component {

	render() {
		return (
			<div style={comStyles().container}>
				HowItWorksLandlord
			</div>
		)
	}
}

// defines the types of variables in this.props
HowItWorksLandlord.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
HowItWorksLandlord.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(HowItWorksLandlord)

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
		}
	}
}

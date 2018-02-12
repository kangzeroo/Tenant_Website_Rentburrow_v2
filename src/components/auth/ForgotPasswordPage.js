// Compt for copying as a ForgotPasswordPage
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
	Header,
} from 'semantic-ui-react'
import ForgotPassword from './ForgotPassword'


class ForgotPasswordPage extends Component {

	render() {
		return (
			<div id='ForgotPasswordPage' style={comStyles().container}>
				<ForgotPassword />
			</div>
		)
	}
}

// defines the types of variables in this.props
ForgotPasswordPage.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
ForgotPasswordPage.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ForgotPasswordPage)

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
      width: '100%',
      height: '80vh',
      justifyContent: 'center',
      alignItems: 'center',
			padding: '50px',
		}
	}
}

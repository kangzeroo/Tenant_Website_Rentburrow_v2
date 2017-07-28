// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Button,
} from 'semantic-ui-react'
import { loginFacebook } from '../../api/auth/facebook_auth'


class LoginPopup extends Component {

  loginWithFacebook() {
    loginFacebook().then((fbProfile) => {
      console.log(fbProfile)
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Button onClick={() => this.loginWithFacebook()}>Login with Facebook</Button>
				<Button>Login with Google</Button>
				<Button>Login with Email</Button>
			</div>
		)
	}
}

// defines the types of variables in this.props
LoginPopup.propTypes = {
	history: PropTypes.object.isRequired,

}

// for all optional props, define a default value
LoginPopup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(LoginPopup)

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

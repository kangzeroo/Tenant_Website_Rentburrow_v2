// Compt for logging out functionality

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { logoutTenant } from '../../actions/auth/auth_actions'
import { signOutLandlord, signOutStudent } from '../../api/aws/aws-cognito'
import { logoutFacebook } from '../../api/auth/facebook_auth'


class Logout extends Component {

	componentWillMount() {
		this.props.logoutTenant()
		logoutFacebook()
		signOutStudent()
		this.props.history.push('/')
		localStorage.removeItem('favorites')
	}

	render() {
		return (
			<div id='Logout' style={comStyles().container}>
				<p>Sorry to see you go...</p>
			</div>
		)
	}
}

Logout.propTypes = {
	history: PropTypes.object,
	logoutTenant: PropTypes.func.isRequired,
}

const RadiumHOC = Radium(Logout);

export default withRouter(
	connect(null, {
		logoutTenant,
	})(RadiumHOC)
)

// ==================================


const comStyles = () => {
	return {
		container: {
			minHeight: '94vh',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}
	}
}

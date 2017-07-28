// Compt for logging out functionality

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { removeStaffProfile, unauthenticateStaff } from '../../actions/auth/auth_actions'
import { signOutLandlord } from '../../api/aws/aws-cognito'

class Signout extends Component {

	componentWillMount() {
		// remove state in Redux
		this.props.removeStaffProfile()
		// forget this user by clearing local cookies & localStorage
		signOutLandlord()
		// unauthenticate staff in Redux
		this.props.unauthenticateStaff()
		// redirect to the '/public' page
		this.props.history.push('/public')
	}

	render() {
		return (
			<div>
				<p>Sorry to see you go...</p>
			</div>
		)
	}
}

Signout.propTypes = {
	removeStaffProfile: PropTypes.func.isRequired,
	unauthenticateStaff: PropTypes.func.isRequired,
	history: PropTypes.object,
}

const RadiumHOC = Radium(Signout);

export default withRouter(
	connect(null, {
		removeStaffProfile,
		unauthenticateStaff,
	})(RadiumHOC)
)

// ==================================


// const comStyles = () => {
// 	return {
// 		background: {
// 			backgroundColor: xMidBlue,
// 			width: "100%",
// 			height: "100%",
// 			margin: "0",
// 			left: "0",
// 			top: "0",
// 			display:"flex",
// 			WebkitBoxPack: "justify", WebkitJustifyContent: "center", justifyContent: "center"
// 		},
// 		goodbye: {
// 			fontSize: "1.5rem",
// 			fontWeight: "bold",
// 			color: "white",
// 			margin: "auto"
// 		}
// 	}
// }

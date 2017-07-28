// Compt for registering as a staff

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
	Input,
	Button,
} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { RegisterLandlord } from '../../api/aws/aws-cognito'

import { sendRegisterInfo } from '../../api/auth/register_api'

class Register extends Component {

	constructor() {
		super()
		this.state = {
			email: '',											// email typed in
			password: '',										// password typed in
			confirmPassword: '',						// password confirmation typed in
			preferred_username: '',					// staff name typed in
			phone_number: '',								// staff phone number typed in
			staff_title: 'Admin',						// admin by default for newly registered staff account
			errorMessage: null,							// error message to display
			loading: false,									// loading flag
			success: false,									// success flag
		}
		this.enterKeyPressedStream = null
	}

	// we will use internal compt state to manage some observables
	// they are fully attentive and respond to changes
	componentDidUpdate() {
		// submits the form when you press enter
		const confirmPasswordInput = document.getElementById('confirm_password_input')
		if (confirmPasswordInput && !this.enterKeyPressedStream) {
	    const enterKeyPressedStream = Rx.Observable.fromEvent(confirmPasswordInput, 'keyup').filter(e => e.keyCode === 13)
			this.enterKeyPressedStream = enterKeyPressedStream.subscribe({
				next: () => this.submitRegistration(this.state)
			})
		}
	}

	updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

	// submit registration to AWS Cognito
	submitRegistration(state) {
		// validation of passwords
		if (state.password === state.confirmPassword) {
			this.setState({
				loading: true,
				errorMessage: null,
			}, () => {
				// submit registration to AWS Cognito
				RegisterLandlord(state).then(({ email, cognito_id }) => {
					// save the email to localStorage for future reference
					localStorage.setItem('RentBurrow_Email', email)
					// send registration info object to node server
					const registerJSON = {
						staff_id: cognito_id,
						email,
						name: this.state.preferred_username,
						phone: this.state.phone_number,
						staff_title: this.state.staff_title,
					}
					return sendRegisterInfo(registerJSON)
				}).then((data) => {
					this.setState({
						loading: false,
						errorMessage: data,
						success: true
					}, () => {
						// redirect to account verification page
						this.props.history.push('/register/verify')
					})
				}).catch((err) => {
					this.setState({
						loading: false,
						errorMessage: err.message,
					})
				})
			})
		} else {
			this.setState({
				errorMessage: 'Passwords must match'
			})
		}
	}

	render() {
		return (
			<div style={comStyles().container}>
				<p>REGISTER PAGE</p>
				<Input value={this.state.preferred_username} onChange={(e) => this.updateAttr(e, 'preferred_username')} type='text' placeholder='Full Name' />
				{
					this.state.preferred_username.length > 0
					?
					<Input value={this.state.phone_number} onChange={(e) => this.updateAttr(e, 'phone_number')} type='tel' placeholder='Phone Number' />
					:
					null
				}
				{
					this.state.phone_number.length > 0
					?
					<Input value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='email' placeholder='Email' />
					:
					null
				}
				{
					this.state.email.length > 0
					?
					<Input value={this.state.password} onChange={(e) => this.updateAttr(e, 'password')} type='password' placeholder='Password' />
					:
					null
				}
				{
					this.state.password.length > 0
					?
					<Input id='confirm_password_input' value={this.state.confirmPassword} onChange={(e) => this.updateAttr(e, 'confirmPassword')} type='password' placeholder='Confirm Password' />
					:
					null
				}
				{
					this.state.errorMessage
					?
					<strong>{ this.state.errorMessage }</strong>
					:
					null
				}
				{

				}
				{
					this.state.confirmPassword.length > 0 && !this.state.success
					?
					<Button loading={this.state.loading} onClick={() => this.submitRegistration(this.state)}>
				    Submit
				  </Button>
					:
					null
				}
				<Link to='/login'>I already have an account</Link>
			</div>
		);
	}
}

Register.propTypes = {
	history: PropTypes.object
}

const RadiumHOC = Radium(Register);

const mapStateToProps = (state) => {
	return {
		// errorMessage: state.auth.error
	}
}

export default withRouter(
	connect(mapStateToProps, {

	})(RadiumHOC)
)

// ========================================================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
		}
	}
}

// const comStyles = () => {
// 	return {
// 		mainview: {
// 			backgroundColor: xMidBlue,
// 			width: "100%",
// 			height: "100%",
// 			margin: "0",
// 			left: "0",
// 			top: "0",
// 			display: "-webkit-box", display: "-webkit-flex", display: "flexbox", display: "box", display: "flex",
// 			WebkitBoxPack: "justify", WebkitJustifyContent: "center", justifyContent: "center"
// 		},
// 		entrance: {
// 			display: "-webkit-box", display: "-webkit-flex", display: "flexbox", display: "box", display: "flex",
// 			WebkitBoxOrient: "vertical", WebkitBoxDirection: "normal", flexDirection: "column",
// 			margin: "auto",
// 			WebkitBoxPack: "justify", WebkitJustifyContent: "center", justifyContent: "center"
// 		},
// 		form: {
// 			width: "500px",
// 			margin: "auto",
// 			[mediaQuerySize]: {
// 				width: "90%"
// 			}
// 		},
// 		formText: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			fontWeight: "bold"
// 		},
// 		formInput: {
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			backgroundColor: "rgba(256,256,256,0.9)"
// 		},
// 		corporationText: {
// 			color: "white",
// 			fontWeight: "bold",
// 			textAlign: "center",
// 			margin: "15px auto"
// 		},
// 		logo: {
// 			height: "150px",
// 			width: "auto",
// 			margin: "15px auto"
// 		},
// 		Register: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "50px auto",
// 			cursor: "pointer"
// 		},
// 		note: {
// 			fontSize: "1rem",
// 			color: "white",
// 		},
// 		signin: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "50px auto",
// 			cursor: "pointer"
// 		},
// 		errorMessage: {
// 			margin: "15px auto",
// 		},
// 		loadingBox: {
// 			width: "500px",
// 			margin: "auto",
// 			display: "-webkit-box", display: "-webkit-flex", display: "flexbox", display: "box", display: "flex",
// 			WebkitBoxOrient: "horizontal", WebkitBoxDirection: "normal", flexDirection: "row",
// 			WebkitBoxPack: "justify", WebkitJustifyContent: "center", justifyContent: "center",
// 			WebkitAlignItems: "center", WebkitBoxAlign: "center", alignItems: "center",
// 			[mediaQuerySize]: {
// 				width: "90%"
// 			}
// 		},
// 		loadingGif: {
// 			width: "50px",
// 			height: "50px"
// 		}
// 	}
// }

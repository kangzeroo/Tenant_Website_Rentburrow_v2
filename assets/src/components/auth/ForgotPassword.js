// Compt for forgetting a password and reseting it


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter, Link } from 'react-router-dom'
import {
	Input,
	Button,
} from 'semantic-ui-react'
import { forgotPassword } from '../../api/aws/aws-cognito'

class ForgotPassword extends Component {

	constructor() {
		super()
		this.state = {
			email: '',									// email typed in
			pin: '',										// pin typed in
			sent: false,								// the reset email has been sent
			reset: false,								// the password has been reset
			new_password: '',						// new password typed in
			new_password_confirm: '',		// new password confirmation typed in
			cognitoUserPackage: null,		// the AWS Cognito object that will be used later
			errorMessage: null,					// error message for display
			loading: false,							// loading flag
		}
		this.observableForPasswordConfirmInput = null		// observable for password input (submit on pressing enter)
	}

	componentDidMount() {
		// submits the resend pin form when you press enter
		const emailInput = document.getElementById('email_input')
    const emailEnterKeyPressedStream = Rx.Observable.fromEvent(emailInput, 'keyup').filter(e => e.keyCode === 13)
		emailEnterKeyPressedStream.subscribe({
			next: () => this.sendPasswordReset(this.state)
		})
	}

	componentDidUpdate() {
		const passwordInput = document.getElementById('password_confirm_input')
		if (passwordInput && !this.observableForPasswordConfirmInput) {
			// submits the verify pin form when you press enter
	    const passwordEnterKeyPressedStream = Rx.Observable.fromEvent(passwordInput, 'keyup').filter(e => e.keyCode === 13)
			this.observableForPasswordConfirmInput = passwordEnterKeyPressedStream.subscribe({
				next: () => this.verifyPin(this.state)
			})
		}
	}

	updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

	// Send AWS Cognito email to re-set password
	sendPasswordReset(state) {
		this.setState({
			loading: true
		}, () => {
			// Send AWS Cognito email to re-set password
			forgotPassword(state.email)
				.then((cognitoUserPackage) => {
					this.setState({
						cognitoUserPackage,
						loading: false,
						sent: true,
					})
				})
				.catch((err) => {
					this.setState({
						errorMessage: err.message,
						loading: false
					})
				})
		})
	}

	// verify the pin and submit the new password
	verifyPin(state) {
		if (state.new_password === state.new_password_confirm) {
			this.setState({
				loading: true,
			}, () => {
				// confirm the new password with AWS Cognito
				state.cognitoUserPackage.cognitoUser
					.confirmPassword(state.pin, state.new_password, state.cognitoUserPackage.thirdArg)
				setTimeout(() => {
					this.setState({
						loading: false,
						reset: true,
					})
					this.props.history.push('/login?passwordReset')
				}, 1000)
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
				<p>RESET PASSWORD</p>
				{
					this.state.errorMessage
					?
					this.state.errorMessage
					:
					null
				}
				{
					this.state.sent
					?
					<div style={comStyles().ForgotPassword}>
						<Input value={this.state.pin} onChange={(e) => this.updateAttr(e, 'pin')} type='text' placeholder='Verification PIN' />
						<Input value={this.state.new_password} onChange={(e) => this.updateAttr(e, 'new_password')} type='password' placeholder='New Password' />
						<Input id='password_confirm_input' value={this.state.new_password_confirm} onChange={(e) => this.updateAttr(e, 'new_password_confirm')} type='password' placeholder='New Password Confirm' />
						{
							this.state.reset
							?
							<Link to='/login'>
								<Button>
							    Login
							  </Button>
							</Link>
							:
							<Button loading={this.state.loading} onClick={() => this.verifyPin(this.state)}>
						    Submit
						  </Button>
						}
					</div>
					:
					<div style={comStyles().sendResetEmail}>
						<Input id='email_input' value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='email' placeholder='Email' />
						<Button loading={this.state.loading} onClick={() => this.sendPasswordReset(this.state)}>
					    Submit
					  </Button>
					</div>
				}
				<Link to='/login'>Go back to login</Link>
			</div>
		);
	}
}

ForgotPassword.propTypes = {
	history: PropTypes.object.isRequired,
}

const RadiumHOC = Radium(ForgotPassword);

// if there is an error, it will appear on the state tree
const mapStateToProps = (state) => {
	return {
	}
}

export default withRouter(
	connect(mapStateToProps)(RadiumHOC)
)


// =========================================================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
		},
		sendResetEmail: {
			display: 'flex',
			flexDirection: 'column',
		},
		ForgotPassword: {
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
// 			fontWeight: "bold",
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
// 			height: "250px",
// 			width: "auto",
// 			margin: "15px auto"
// 		},
// 		back: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "50px auto",
// 			cursor: "pointer"
// 		},
// 		errorMessage: {
// 			width: "500px",
// 			margin: "15px auto",
// 			[mediaQuerySize]: {
// 				width: "90%"
// 			}
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

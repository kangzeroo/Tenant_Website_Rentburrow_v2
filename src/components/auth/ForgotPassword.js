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
	Form,
	Header,
} from 'semantic-ui-react'
import { forgotPassword } from '../../api/aws/aws-cognito'
import { validateEmail } from '../../api/general/general_api'

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
			error_messages: [],							// error message to display
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
		if (this.validateForm()) {
			this.setState({
				loading: true
			}, () => {
				// Send AWS Cognito email to re-set password
				forgotPassword(state.email)
					.then((cognitoUserPackage) => {
						console.log(cognitoUserPackage)
						this.setState({
							cognitoUserPackage,
							loading: false,
							sent: true,
						})
						localStorage.setItem('RentBurrow_Email', this.state.email)
					})
					.catch((err) => {
						this.setState({
							errorMessage: err.message,
							loading: false
						})
					})
			})
		}
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

	validateForm() {
		const error_messages = []
		if (!this.state.email && !validateEmail(this.state.email)) {
			error_messages.push('You must provide a valid email')
		}
		this.setState({
			error_messages: error_messages,
			loading: false,
		})
		return error_messages.length === 0
	}

	renderVerifyPIN() {
		return (
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
		)
	}

	renderResetPassword() {
		return (
			<div>
				<Header
					as='h2'
					content='Reset Password'
					subheader={`We'll send you an email to reset your password`}
				/>
				<Form style={comStyles().sendResetEmail}>
					<Form.Field>
						<label>Email Address</label>
						<Input id='email_input' value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='email' placeholder='Email' />
					</Form.Field>
					<Form.Field style={comStyles().col}>
					{
						this.state.errorMessage
						?
						<strong>{ this.state.errorMessage.message }</strong>
						:
						null
					}
					{
						this.state.error_messages.map((err, index) => {
							return (
								<strong style={comStyles().red} key={index}>*{ err }</strong>
							)
						})
					}
					</Form.Field>
					<Form.Field style={comStyles().buttonsContainer}>
						<Button
							color='twitter'
							basic
							content='Back to Login'
							icon='chevron left'
							onClick={() => this.props.backToLogin()}
							size='medium'
							style={comStyles().loginButton}
						/>
						<Button color='twitter' fluid loading={this.state.loading} onClick={() => this.sendPasswordReset(this.state)}>
							Send Reset PIN
						</Button>
					</Form.Field>
				</Form>
			</div>
		)
	}

	render() {
		return (
			<div id='ForgotPassword' style={comStyles().container}>
				{
					this.state.sent
					?
					this.renderVerifyPIN()
					:
					this.renderResetPassword()
				}
			</div>
		);
	}
}

ForgotPassword.propTypes = {
	history: PropTypes.object.isRequired,
	backToLogin: PropTypes.func.isRequired,			// passed in
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
		},
		buttonsContainer: {
			display: 'flex',
			flexDirection: 'row'
		},
		loginButton: {
			width: '30%'
		},
		col: {
			display: 'flex',
			flexDirection: 'column'
		},
		red: {
      color: 'red'
    },
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

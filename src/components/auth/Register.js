// Compt for registering as a staff

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
	Input,
	Button,
	Checkbox,
} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { validateEmail } from '../../api/general/general_api'
import { RegisterStudent } from '../../api/aws/aws-cognito'

import { sendRegisterInfo } from '../../api/auth/register_api'

class Register extends Component {

	constructor() {
		super()
		this.state = {
			first_name: '',
			last_name: '',
			email: '',											// email typed in
			phone_number: '',								// staff phone number typed in
			password: '',										// password typed in
			password_confirmation: '',						// password confirmation typed in
			agreed_to_terms: false,
			error_messages: [],							// error message to display
			loading: false,									// loading flag
			success: false,									// success flag
		}
		this.enterKeyPressedStream = null
	}

	// we will use internal compt state to manage some observables
	// they are fully attentive and respond to changes
	componentDidUpdate() {
		// submits the form when you press enter
		const confirmPasswordInput = document.getElementById('password_confirmation')
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
		if (this.validateForm()) {
			this.setState({
				loading: true,
				error_messages: [],
			}, () => {
				// submit registration to AWS Cognito
				RegisterStudent(state).then(({ email, cognito_id }) => {
					// save the email to localStorage for future reference
					localStorage.setItem('RentHero_Tenant_Email', email)
					// send registration info object to node server
					const registerJSON = {
						tenant_id: cognito_id,
						email,
						first_name: this.state.first_name,
						last_name: this.state.last_name,
						phone: this.state.phone_number,
					}
					this.props.history.push('/register/verify')
					return sendRegisterInfo(registerJSON)
				}).then((data) => {
					this.setState({
						loading: false,
						error_messages: [data],
						success: true
					}, () => {
						// redirect to account verification page
						this.props.history.push('/register/verify')
					})
				}).catch((err) => {
					_LTracker.push({
	          'error': err,
	          'tag' : `${localStorage.getItem('tenant_id')}`
	        })
					this.setState({
						loading: false,
						error_messages: [err.message],
					})
				})
			})
		}
	}

	validateForm() {
		const error_messages = []
		if (!this.state.first_name || !this.state.last_name) {
			error_messages.push('You must provide your first and last name')
		}
		if (!this.state.email && !validateEmail(this.state.email)) {
			error_messages.push('You must provide a valid email')
		}
		if (!this.state.password || !this.state.password_confirmation || (this.state.password !== this.state.password_confirmation)) {
			error_messages.push('You must provide a password and repeat it to verify')
		}
		if (!this.state.agreed_to_terms) {
			error_messages.push('You must agree to the terms and conditions in order to use RentHero')
		}
		this.setState({
			error_messages: error_messages,
			loading: false,
		})
		return error_messages.length === 0
	}

	agreedToTerms() {
		this.setState({
			agreed_to_terms: !this.state.agreed_to_terms
		})
	}

	render() {
		return (
			<div id='Register' style={comStyles().container}>
				<h2>ACCOUNT REGISTRATION</h2>
				<Input value={this.state.first_name} onChange={(e) => this.updateAttr(e, 'first_name')} type='text' placeholder='First Name' />
				<Input value={this.state.last_name} onChange={(e) => this.updateAttr(e, 'last_name')} type='text' placeholder='Last Name' />
				<Input value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='text' placeholder='Email' />
				<Input value={this.state.phone_number} onChange={(e) => this.updateAttr(e, 'phone_number')} type='number' placeholder='Phone Number' />
				<Input value={this.state.password} onChange={(e) => this.updateAttr(e, 'password')} type='password' placeholder='Password' />
				<Input id='password_confirmation' value={this.state.password_confirmation} onChange={(e) => this.updateAttr(e, 'password_confirmation')} type='password' placeholder='Confirm Password' />
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<Checkbox checked={this.state.agreed_to_terms} onClick={() => this.agreedToTerms()} />
					<div> &nbsp; &nbsp; I agree to the <a href={`${window.location.origin}/termsandconditions`} target='_blank'>terms and conditions</a></div>
				</div>
				{
					this.state.error_messages.map((err, index) => {
						return (
							<strong key={index}>{ err }</strong>
						)
					})
				}
				<Button loading={this.state.loading} onClick={() => this.submitRegistration(this.state)}>
			    Submit
			  </Button>
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
			height: '80vh',
			padding: '50px',
			justifyContent: 'space-between',
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

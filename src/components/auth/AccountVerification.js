// Compt for the Account Verification (Enter your verification PIN) page
// For registration verification only, may be replaced by magic link

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
	Input,
	Form,
	Modal,
	Button,
} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { VerifyAccount, resetVerificationPIN } from '../../api/aws/aws-cognito'
import LoginPopup from './LoginPopup'


class AccountVerification extends Component {

	constructor() {
		super()
		this.state = {
			email: '',
			pin: '',
			verified: false,
			errorMessage: null,
			loading: false
		}
	}

	componentWillMount() {
		// Retrieve the email saved in localStorage to save user typing
		const savedEmail = localStorage.getItem('RentHero_Tenant_Email')
		if (savedEmail) {
			this.setState({
				email: savedEmail,
				errorMessage: `Check your email at ${savedEmail} for the confirmation link`
			})
		}
		// get the pin in the url
		const pin_string_location = this.props.location.search.indexOf('pin=')
		// get the email in the url
		const email_string_location = this.props.location.search.indexOf('email=')
		if (pin_string_location > -1 && email_string_location > -1) {
			// if the pin & email is present in the url, then auto-submit the pin and redirect to login page
			const pin = this.props.location.search.slice(pin_string_location+4, pin_string_location+10)
			const email = decodeURIComponent(this.props.location.search.slice(email_string_location+6, pin_string_location-1))
			this.setState({
				email: email,
				pin: pin,
			}, () => {
				if (this.state.email && this.state.pin) {
					this.submitVerification(this.state).then(() => {
						// ?verified will trigger a popup modal
						this.props.history.push('/login?verified')
					})
				}
			})
		}
	}

	componentDidMount() {
		// submits the form when you press enter
		const pinInput = document.getElementById('pin_input')
    const enterKeyPressedStream = Rx.Observable.fromEvent(pinInput, 'keyup').filter(e => e.keyCode === 13)
		enterKeyPressedStream.subscribe({
			next: () => this.submitVerification(this.state)
		})
	}

	updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

	// submit account verification PIN to AWS Cognito
	submitVerification(state) {
		const p = new Promise((res, rej) => {
			this.setState({
				loading: true,
				errorMessage: null,
			}, () => {
				// submit account verification PIN to AWS Cognito
				VerifyAccount(state).then(() => {
					this.setState({
						loading: false,
						verified: true,
						errorMessage: 'Successfully verified account',
					})
					this.toggleModal(true, 'login')
					res()
				}).catch((err) => {
					this.setState({
						loading: false,
						errorMessage: err.message,
					})
					rej()
				})
			})
		})
		return p
	}

	// send account verification PIN for AWS Cognito
	resendPIN(state) {
		this.setState({
			loading: true,
		}, () => {
			// send account verification PIN for AWS Cognito
			resetVerificationPIN(state)
				.then(() => {
					this.setState({
						loading: false,
						errorMessage: `Your PIN has been verified to ${this.state.email}. Be sure to check the spam folder just in case.`
					})
				})
				.catch((err) => {
					// console.log(err.message)
					this.setState({
						errorMessage: err.message,
						loading: false
					})
				})
		})
	}

	toggleModal(bool, attr, context) {
		this.setState({
			toggle_modal: bool,
			modal_name: attr,
			context: context
		})
	}

	renderLoginSuite(context) {
    return (
        <div style={comStyles().login_modal}>
          <Modal.Content>
            <LoginPopup
              toggleModal={() => this.toggleModal(false)}
              context={context}
            />
          </Modal.Content>
        </div>
    )
  }

	renderAppropriateModal(modal_name, context) {
		if (modal_name === 'login') {
			return this.renderLoginSuite('login')
		} else if (modal_name === 'signup') {
			return this.renderLoginSuite('signup')
		} else if (modal_name === 'request') {
			return this.renderRequest()
		}
		return null
	}

	render() {
		return (
			<div id='AccountVerification' style={comStyles().container}>
				<Form>
					<h2>Verify Account</h2>
					<Form.Field>
						<label>Email Address</label>
						<Input id='email_input' value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='text' placeholder='Email Address' />
					</Form.Field>
					<Form.Field>
						<label>Verification PIN</label>
						<Input id='pin_input' value={this.state.pin} onChange={(e) => this.updateAttr(e, 'pin')} type='text' placeholder='Verification PIN' />
					</Form.Field>
					<Form.Field>
					{
						this.state.errorMessage
						?
						<strong>{ this.state.errorMessage }</strong>
						:
						null
					}
					</Form.Field>
					<Form.Field>
						{
							this.state.verified
							?
							<Link to='/login?verified'>
								<Button>
									Login
								</Button>
							</Link>
							:
							<Button
								color='blue'
								fluid
								loading={this.state.loading}
								onClick={() => this.submitVerification(this.state)}
								content='Verify PIN'
							/>
						}
					</Form.Field>
					<Form.Field>
						<div style={comStyles().resend} onClick={() => this.resendPIN(this.state)}>Resend PIN</div>
					</Form.Field>
				</Form>
				<Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
					{
						this.renderAppropriateModal(this.state.modal_name, this.state.context)
					}
				</Modal>
			</div>
		)
	}
}

AccountVerification.propTypes = {
	history: PropTypes.object,
	location: PropTypes.object,
}

const RadiumHOC = Radium(AccountVerification);

// if there is an error, it will appear on the state tree
const mapStateToProps = (state) => {
	return {
		// corporation: state.corporation.corporation
	}
}

export default withRouter(
	connect(mapStateToProps, {

	})(RadiumHOC)
)


// =========================================================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
			height: '80vh',
			padding: '50px',
		},
		resend: {
      marginLeft: '5px',
			fontSize: '1.2rem',
			color: '#6495ED',
			cursor: 'pointer',
			':hover': {
				textDecoration: 'underline'
			}
		},
	}
}

//
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
// 		resend: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "30px 0px 0px 0px",
// 			cursor: "pointer"
// 		},
// 		back: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "10px auto",
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
// 		},
// 		login: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "30px 0px 0px 0px",
// 			cursor: "pointer"
// 		}
// 	}
// }

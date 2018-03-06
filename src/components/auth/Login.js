// Compt for logging in to landlord dashboard


import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import {
	Input,
	Button,
	Header,
	Icon,
	Form,
	Modal,
	Loader,
	Dimmer,
} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

import { LoginStudent, buildUserObject } from '../../api/aws/aws-cognito'
import { insertBuildingFavorite, insertSuiteFavorite } from '../../api/tenant/favorite_api'
import { getTenantProfile, } from '../../api/auth/tenant_api'
import { saveTenantToRedux, triggerForcedSigninFavorite } from '../../actions/auth/auth_actions'

class Login extends Component {

	constructor() {
		super()
		this.state = {
			email: '',											// the email typed in
			password: '',										// the password typed in
			login_loading: false,
			errorMessage: null,							// error message to be shown
			verified_modal: false,					// flag for popup modal to tell user they're verified
			reset_modal: false,					// flag for popup modal to tell user their password was reset
		}
		this.cognitoUser = null
	}

	componentWillMount() {
		// if we have it saved, get the most recent email entered
		const savedEmail = localStorage.getItem('RentHero_Tenant_Email')
		if (savedEmail) {
			this.setState({
				email: savedEmail
			})
		}
		// if ?verified in the url, then trigger a popup modal message
		const verified_string_location = this.props.location.search.indexOf('verified')
		if (verified_string_location > -1) {
			this.setState({
				verified_modal: true
			})
		}
		// if ?passwordReset in the url, then trigger a popup modal message
		const reset_string_location = this.props.location.search.indexOf('passwordReset')
		if (reset_string_location > -1) {
			this.setState({
				reset_modal: true
			})
		}
		/*
		this.props.saveCorporationProfile({
      corp_id: 'ghdlfj2-43fdsfj-43kjda',
      corp_name: 'RezOne',
    })*/
	}

	componentDidMount() {
		// submits the form when you press enter
		const passwordInput = document.getElementById('password_input')
    const enterKeyPressedStream = Rx.Observable.fromEvent(passwordInput, 'keyup').filter(e => e.keyCode === 13)
		enterKeyPressedStream.subscribe({
			next: () => this.submitLogin(this.state)
		})
	}

	updateAttr(event, attr) {
		this.setState({
			[attr]: event.target.value
		})
	}

	// submit login to AWS Cognito
	submitLogin(state) {
		// this.props.toggleAuthLoading(true)
		this.setState({
			login_loading: true,
		})
		// login to aws cognito and get the staff details back
		LoginStudent(state).then((data) => {
			// reflect successful login in UI
			this.setState({
				submitted_staff: true,
				errorMessage: '',
				login_loading: false,
			})
			this.props.closeModal()
			if (this.props.temporary_favorite_force_signin.fav_type === 'building') {
				insertBuildingFavorite(data.sub, this.props.temporary_favorite_force_signin.building_id)
				// const favs = JSON.parse(localStorage.getItem('favorites'))
				// localStorage.setItem('favorites', JSON.stringify([{ building_id: this.props.temporary_favorite_force_signin.building_id }]))
				this.props.triggerForcedSigninFavorite({})
			} else if (this.props.temporary_favorite_force_signin.fav_type === 'suite') {
				insertSuiteFavorite(data.sub, this.props.temporary_favorite_force_signin.building_id, this.props.temporary_favorite_force_signin.suite_id)
				// const favs = JSON.parse(localStorage.getItem('favorites'))
				// localStorage.setItem('favorites', JSON.stringify([{ building_id: this.props.temporary_favorite_force_signin.building_id, suite_id: this.props.temporary_favorite_force_signin.suite_id, }]))
				this.props.triggerForcedSigninFavorite({})
			}
			// get the full staff details using the staff_id from AWS Cognito
			getTenantProfile({ tenant_id: data.sub })
				.then((tenantData) => {


					// save the authenticated staff to Redux state
	        this.props.saveTenantToRedux(tenantData)
					// this.props.history.push('/')
				})
				.catch((err) => {
					_LTracker.push({
	          'error': err,
	          'tag' : `${localStorage.getItem('tenant_id')}`
	        })
					this.setState({
						errorMessage: 'Error logging in.'
					})
				})
		}).catch((err) => {
			_LTracker.push({
				'error': err,
				'tag' : `${localStorage.getItem('tenant_id')}`
			})
			// this.props.toggleAuthLoading(false)
			this.setState({
				errorMessage: err.message,
				login_loading: false,
			})
		})
	}

	// the modal for showing reset status
	renderResetModal() {
		return (
			<Modal open={this.state.reset_modal} basic size='small'>
				<Header icon='checkmark' content='Password Successfully Reset' />
				<Modal.Content>
					<p>Try to login again with your new password.</p>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={() => this.setState({ reset_modal: false })} color='green' inverted>
						<Icon name='checkmark' /> Ok
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}


	// the modal for showing verified status
	renderVerifiedModal() {
		return (
			<Modal open={this.state.verified_modal} basic size='small'>
				<Header icon='checkmark' content='Account Successfully Verified' />
				<Modal.Content>
					<p>Now it&apos;s time to login and set up your account. See you inside!</p>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={() => this.setState({ verified_modal: false })} color='green' inverted>
						<Icon name='checkmark' /> Let&apos;s Go
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}

	renderLogin() {
		return (
			<div style={comStyles().loginContainer} >

				<div style={comStyles().loginText} ><h3>Email Login</h3></div>
				<div style={comStyles().login}>
					<Input id='email_input' value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='email' placeholder='E-mail Address' />
					<Input id='password_input' value={this.state.password} onChange={(e) => this.updateAttr(e, 'password')} type='password' placeholder='Password' />
					{
						this.state.errorMessage
						?
						<strong>{ this.state.errorMessage.message }</strong>
						:
						null
					}
					{
						this.state.submitted_staff
						?
						null
						:
						<Button primary loading={this.state.login_loading} onClick={() => this.submitLogin(this.state)}>
							Login
						</Button>
					}
					<div tabIndex='0' role='button' onClick={() => this.props.forgotPassword()}>Forgot Password</div>
					<div tabIndex='-1' role='button' onClick={() => this.props.signupState()}>Sign Up</div>

					{ this.renderVerifiedModal() }
					{ this.renderResetModal() }
				</div>
			</div>
		)
	}

	render() {
		if (this.props.authenticated) {
			return (
				<Button primary onClick={() => this.props.history.push('/')}>
					BEGIN EXPLORING
				</Button>
			)
		} else {
			return (
				<div id='Login' style={comStyles().container} >
					<Form style={comStyles().emailContainer} size='small' >
						<Form.Field>
							<label>Email Address</label>
							<Input id='email_input' value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='email' placeholder='E-mail Address' />
						</Form.Field>
						<Form.Field>
							<label>Password</label>
							<Input id='password_input' value={this.state.password} onChange={(e) => this.updateAttr(e, 'password')} type='password' placeholder='Password' />
						</Form.Field>
						{/*<div style={comStyles().registerContainer} >
							<p> New to Rentburrow? </p>
							<Link to='/register' > Register Here </Link>
						</div>*/}

						<Form.Field>
						{
							this.state.errorMessage
							?
							<strong>{ this.state.errorMessage.message }</strong>
							:
							null
						}
						{
							this.state.submitted_staff
							?
							null
							:
							<Button color='twitter' fluid size='small' loading={this.state.login_loading} onClick={() => this.submitLogin(this.state)}>
								Login
							</Button>
						}
						</Form.Field>
						<Form.Field>
							<div tabIndex='0' role='button' onClick={() => this.props.forgotPassword()} style={comStyles().forgot}>Forgot Password</div>
						</Form.Field>
						{
							this.props.ignore_signup
							?
							null
							:
							<Form.Field style={comStyles().row}>
								<div>{`Don't have an account?`}</div>
								<div tabIndex='-1' role='button' onClick={() => this.props.signupState()} style={comStyles().signup}>Sign Up</div>
							</Form.Field>
						}


						{ this.renderVerifiedModal() }
						{ this.renderResetModal() }
					</Form>
				</div>
			)
		}
	}
}

Login.propTypes = {
  history: PropTypes.object,
	saveTenantToRedux: PropTypes.func.isRequired,
	closeModal: PropTypes.func,					// passed in
	facebook_only: PropTypes.bool,			// passed in
	signupState: PropTypes.func.isRequired,	// passed in
	forgotPassword: PropTypes.func.isRequired,		// passed in
	ignore_signup: PropTypes.bool,								// passed in
  temporary_favorite_force_signin: PropTypes.object,
  triggerForcedSigninFavorite: PropTypes.func.isRequired,
	authenticated: PropTypes.bool,
}

// for all optional props, define a default value
Login.defaultProps = {
  closeModal: () => {},
	temporary_favorite_force_signin: null,
	authenticated: false,
	ignore_signup: false,
}

const RadiumHOC = Radium(Login)

// if there is an error, it will appear on the state tree
const mapStateToProps = (redux) => {
	return {
		temporary_favorite_force_signin: redux.auth.temporary_favorite_force_signin,
		authenticated: redux.auth.authenticated,
	}
}

export default withRouter(
	connect(mapStateToProps, {
		saveTenantToRedux,
    triggerForcedSigninFavorite,
	})(RadiumHOC)
)


// =========================================================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		},
		login: {
			display: 'flex',
			flexDirection: 'column',
		},
		loginContainer: {
			display: 'flex',
			flexDirection: 'column',
			width: '400px',
			backgroundColor: 'aliceblue',
			borderRadius: '3px',
			padding: '20px 10px 10px 10px',
			border: 'gray solid thin',
		},
		loginText: {
			width: '400px',
			display: 'flex',
			justifyContent: 'center',
			padding: '10px 0px 10px 0px,',
			margin: '0px 0px 10px 0px',
		},
		registerContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			backgroundColor: 'aliceblue',
			width: '400px',
			margin: '30px 0px 0px 0px',
			padding: '10px 0px 0px 0px',
			borderRadius: '3px',
			border: 'gray solid thin',
		},
		emailContainer: {
			width: '100%'
		},
		row: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
			width: '40%'
		},
		signup: {
			marginLeft: '5px',
			fontSize: '1.2rem',
			color: '#6495ED',
			cursor: 'pointer',
			':hover': {
				textDecoration: 'underline'
			}
		},
		forgot: {
			color: '#6495ED',
			margin: '0 auto',
			cursor: 'pointer'
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
// 			WebkitBoxPack: "justify", WebkitJustifyContent: "center", justifyContent: "center",
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
// 		signup: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "50px 0px 0px 0px",
// 			cursor: "pointer"
// 		},
// 		forgot: {
// 			color: "white",
// 			fontSize: "1.2rem",
// 			textAlign: "center",
// 			margin: "10px",
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

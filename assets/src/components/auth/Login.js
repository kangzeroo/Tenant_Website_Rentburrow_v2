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
	Modal,
} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

import { saveCorporationProfile, setStaffProfile, authenticateStaff } from '../../actions/auth/auth_actions'
import { saveBuildingsForCorp } from '../../actions/corporation/corporation_actions'
import { LoginLandlord } from '../../api/aws/aws-cognito'
import { getBuildingsForCorporation } from '../../api/building/building_api'
import { getCorpInfo } from '../../api/corporation/corporation_api'
import { getStaffInfo } from '../../api/staff/staff_api'

class Login extends Component {

	constructor() {
		super()
		this.state = {
			email: '',											// the email typed in
			password: '',										// the password typed in
			submitted_staff: false,					// flag for submit button
			errorMessage: null,							// error message to be shown
			loading: false,									// flag for loading status
			verified_modal: false,					// flag for popup modal to tell user they're verified
			reset_modal: false,					// flag for popup modal to tell user their password was reset
		}
	}

	componentWillMount() {
		// if we have it saved, get the most recent email entered
		const savedEmail = localStorage.getItem('RentBurrow_Email')
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
		this.setState({
			loading: true
		}, () => {
			// login to aws cognito and get the staff details back
			LoginLandlord(state).then((staff) => {
				// reflect successful login in UI
				this.setState({
					loading: false,
					submitted_staff: true,
					errorMessage: '',
				}, () => {
					// get the full staff details using the staff_id from AWS Cognito
					getStaffInfo(staff.sub)
						.then((fullStaff) => {
							// save the authenticated staff to Redux state
							this.saveStaffProfile(fullStaff)
						})
				})
			}).catch((err) => {
				console.log(err)
				this.setState({
					loading: false,
					errorMessage: err.message,
				})
			})
		})
	}

	// save staff to redux
	saveStaffProfile(staff) {
		this.props.setStaffProfile(staff)
		this.props.authenticateStaff()
		getCorpInfo(staff.corporation_id).then((corp) => {
			this.props.saveCorporationProfile(corp)
		})
		getBuildingsForCorporation(staff.corporation_id).then((buildings) => {
			this.props.saveBuildingsForCorp(buildings)
			this.props.history.push('/dashboard')
		})
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

	render() {
		return (
			<div style={comStyles().container}>
				<p>LOGIN PAGE</p>
				<Input id='email_input' value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='email' placeholder='Email' />
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
					<Button loading={this.state.loading} onClick={() => this.submitLogin(this.state)}>
				    Submit
				  </Button>
				}
				<Link to='/login/forgot'>Forgot Password</Link>

				{ this.renderVerifiedModal() }
				{ this.renderResetModal() }
			</div>
		);
	}
}

Login.propTypes = {
	setStaffProfile: PropTypes.func.isRequired,
	authenticateStaff: PropTypes.func.isRequired,
	saveCorporationProfile: PropTypes.func.isRequired,
	saveBuildingsForCorp: PropTypes.func.isRequired,
  history: PropTypes.object,
}

const RadiumHOC = Radium(Login)

// if there is an error, it will appear on the state tree
const mapStateToProps = (state) => {
	return {
	}
}

export default withRouter(
	connect(mapStateToProps, {
		setStaffProfile,
		authenticateStaff,
		saveCorporationProfile,
		saveBuildingsForCorp,
	})(RadiumHOC)
)


// =========================================================

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

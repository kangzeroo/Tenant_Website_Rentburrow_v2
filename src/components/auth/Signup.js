// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter, Link } from 'react-router-dom'
import {
	Input,
	Button,
  Form,
  Divider,
	Checkbox,
} from 'semantic-ui-react'
import { validateEmail } from '../../api/general/general_api'
import { RegisterStudent } from '../../api/aws/aws-cognito'
import { sendRegisterInfo } from '../../api/auth/register_api'

class Signup extends Component {

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
            this.props.closeModal()
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
    if (!this.state.phone_number) {
      error_messages.push('You must provide your phone number')
    }
		if (!this.state.email && !validateEmail(this.state.email)) {
			error_messages.push('You must provide a valid email')
		}
		if (!this.state.password || !this.state.password_confirmation || (this.state.password !== this.state.password_confirmation)) {
			error_messages.push('You must provide a password and confirm the password')
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
			<div id='Signup' style={comStyles().container}>
				<Form style={comStyles().form} size='small'>
          <Form.Group widths='equal' >
            <Form.Field>
              <label>First Name</label>
              <Input value={this.state.first_name} onChange={(e) => this.updateAttr(e, 'first_name')} type='text' placeholder='First Name' />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input value={this.state.last_name} onChange={(e) => this.updateAttr(e, 'last_name')} type='text' placeholder='Last Name' />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Email Address</label>
            <Input value={this.state.email} onChange={(e) => this.updateAttr(e, 'email')} type='text' placeholder='Email' />
          </Form.Field>
          <Form.Field>
            <label>Phone Number</label>
            <Input value={this.state.phone_number} onChange={(e) => this.updateAttr(e, 'phone_number')} type='number' placeholder='Phone Number' />
          </Form.Field>
          <Form.Field>
            <label>Create a Password</label>
            <Input value={this.state.password} onChange={(e) => this.updateAttr(e, 'password')} type='password' placeholder='Password' />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <Input id='password_confirmation' value={this.state.password_confirmation} onChange={(e) => this.updateAttr(e, 'password_confirmation')} type='password' placeholder='Confirm Password' />
          </Form.Field>
          <Form.Field style={{ display: 'flex', flexDirection: 'row' }}>
            <Checkbox checked={this.state.agreed_to_terms} onClick={() => this.agreedToTerms()} />
						<div> &nbsp; &nbsp; I agree to the <a href={`${window.location.origin}/termsandconditions`} target='_blank'>terms and conditions</a></div>
          </Form.Field>

          <Form.Field style={comStyles().col}>
          {
            this.state.error_messages.map((err, index) => {
              return (
                <strong style={comStyles().red} key={index}>*{ err }</strong>
              )
            })
          }
          </Form.Field>
          <Form.Field>
            <Button color='twitter' fluid size='small' loading={this.state.loading} onClick={() => this.submitRegistration(this.state)}>
              Sign up
            </Button>
          </Form.Field>
          <Form.Field style={comStyles().row}>
            <div>Already have a Rentburrow Account?</div><div style={comStyles().login} onClick={() => this.props.loginComp()}>Log in</div>
          </Form.Field>

        </Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
Signup.propTypes = {
	history: PropTypes.object.isRequired,
  loginComp: PropTypes.func.isRequired,     // passed in
  closeModal: PropTypes.func.isRequired,    // passed in
}

// for all optional props, define a default value
Signup.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(Signup)

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
		},
    form: {
      width: '100%',
    },
    row: {
      display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
      width: '50%'
    },
    col: {
      display: 'flex',
      flexDirection: 'column'
    },
    red: {
      color: 'red'
    },
    login: {
      marginLeft: '5px',
			fontSize: '1.2rem',
			color: '#6495ED',
			cursor: 'pointer',
			':hover': {
				textDecoration: 'underline'
			}
		}
	}
}

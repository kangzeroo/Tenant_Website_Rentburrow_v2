// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
  Header,
  Dropdown,
  Button,
  TextArea,
  Message,
  Segment,
  Loader,
  Dimmer,
  Icon,
  Checkbox,
} from 'semantic-ui-react'
import {
  DatePicker,
  LocaleProvider,
} from 'antd'
import 'antd/lib/date-picker/style/css'
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment'
import { validateEmail, } from '../../../api/general/general_api'
import { insertTenantInquiry } from '../../../api/inquiries/inquiry_api'
import { VerifyAccount, resetVerificationPIN, LoginStudent, RegisterStudent } from '../../../api/aws/aws-cognito'
import { updateTenantPhone, updateTenantEmail, checkIfAccountWithPhoneAndEmailExistsAlready, getTenantProfile } from '../../../api/auth/tenant_api'
import { sendInitialMessage, sendInitialCorporateInquiry, verifyPhone, } from '../../../api/sms/sms_api'
import { getLandlordInfo, } from '../../../api/search/search_api'
import { sendRegisterInfo } from '../../../api/auth/register_api'
import { saveTenantToRedux } from '../../../actions/auth/auth_actions'
import { getLandlordOfficeHours } from '../../../api/building/building_api'
import Login from '../../auth/Login'
import ForgotPassword from '../../auth/ForgotPassword'

class MessageLandlordForm extends Component {

  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      password: '',										// password typed in
			password_confirmation: '',						// password confirmation typed in

      phoneRequired: false,
      emailRequired: false,

      phone: '',
      email: '',

      group_size: 1,
      group_notes: '',
      acknowledge: false,

      tenant_loaded: false,           // to indicate if a user is signed in
      application_step: '',           // to mark which step we are on ['ask_for_password', 'ask_for_verification_pin', '']
      registration_loading: false,    // for loading status of account registration
      verification_pin_loading: false,  // for the loading status of account pin verification
      verification_pin: '',           // for the account registration verification pin
      saving: false,                  // for loading status of submitting inquiry
      submitted: false,               // for submitted inquiry

      error_messages: [],

      office_hours: {},
      office_hours_ended: false,
    }
    this.school_options = [
      { key: 'uw', text: 'University of Waterloo', value: 'University of Waterloo' },
      { key: 'wlu', text: 'Wilfrid Laurier University', value: 'Wilfrid Laurier University' },
      { key: 'conestoga', text: 'Conestoga College', value: 'Conestoga College' },
      { key: 'other', text: 'Other', value: 'Other' },
    ]
    this.group_size_options = [
      // { key: 'unknown', text: 'Unknown', value: 0 },
      { key: 'one', text: '1', value: 1 },
      { key: 'two', text: '2', value: 2 },
      { key: 'three', text: '3', value: 3 },
      { key: 'four', text: '4', value: 4 },
      { key: 'five', text: '5', value: 5 },
      { key: 'six', text: '6', value: 6 },
      { key: 'seven', text: '7', value: 7 },
      { key: 'eight', text: '8', value: 8 },
      { key: 'nine', text: '9', value: 9 },
      { key: 'ten', text: '10', value: 10 },
      { key: 'plus', text: '10+', value: 11 },
    ]
    this.gender_options = [
      { key: 'male', text: 'Male', value: 'male' },
      { key: 'female', text: 'Female', value: 'female' },
      { key: 'other', text: 'Other', value: 'other' }
    ]
  }

  componentWillMount() {
    getLandlordOfficeHours(this.props.landlord.corporation_id)
    .then((data) => {
      this.setState({
        office_hours: data,
        office_hours_ended: !(moment().isAfter(moment(data.office_hours_start, 'HHmm')) && moment().isBefore(moment(data.office_hours_end, 'HHmm'))),
      })
    })

    if (this.props.tenant_profile && !this.props.tenant_profile.unauthRoleStudent) {
      this.setState({
        tenant_loaded: true,
      })
    } else {
      this.setState({
        tenant_loaded: false,
      })
    }

    if (!this.props.tenant_profile.phone || this.props.tenant_profile.phone.length === 0) {
      // console.log('no email')
      this.setState({
        phoneRequired: true,
      })
    } else {
      this.setState({
        phone: this.props.tenant_profile.phone,
      })
    }

    if (!this.props.tenant_profile.email || this.props.tenant_profile.email.length === 0) {
      // console.log('no email')
      this.setState({
        emailRequired: true,
      })
    } else {
      this.setState({
        email: this.props.tenant_profile.email,
      })
    }
    this.setState({
      group_notes: `Hello, I'm interested in ${this.props.building.building_alias}`
    })
  }

  updateAttr(e, attr) {
    this.setState({
      [attr]: e.target.value
    })
  }

  updateGroupSize(e, data, attr) {
    this.setState({
      [attr]: data.value,
    })
  }

  validateAccountSignedIn() {
    let ok_to_proceed = true
    const error_messages = []
    if (!this.state.tenant_loaded) {
      error_messages.push('You must create an account first')
      ok_to_proceed = false
    }
    this.setState({
      error_messages: this.state.error_messages.concat(error_messages),
      submitted: false,
      saving: false,
    })
    return ok_to_proceed
  }

  validateForm() {
    let ok_to_proceed = true
    const error_messages = []

    if (!this.state.group_size) {
      error_messages.push('You must specify a group size')
      ok_to_proceed = false
    }
    if (this.state.group_notes.length === 0) {
      error_messages.push('Please enter a Message')
      ok_to_proceed = false
    }
    if (this.state.phoneRequired && this.state.phone.length === 0) {
      error_messages.push('You must enter your phone number')
      ok_to_proceed = false
    }
    if (this.state.emailRequired && this.state.email.length === 0) {
      error_messages.push('You must enter your email address')
      ok_to_proceed = false
    }
    if (this.state.emailRequired && !validateEmail(this.state.email)) {
      error_messages.push('The email address entered is not valid')
      ok_to_proceed = false
    }
    if ((this.state.emailRequired || this.state.phoneRequired) && !this.state.acknowledge) {
      error_messages.push('Please check the checkbox')
      ok_to_proceed = false
    }
    if (this.state.group_notes.length > 1500) {
      error_messages.push('Too many characters in message')
      ok_to_proceed = false
    }
    this.setState({
      error_messages: error_messages,
      submitted: false,
      saving: false,
    })
    return ok_to_proceed
  }

  sendMessageToBothParties() {
    const p = new Promise((res, rej) => {
      let inquiry_id
      if (this.validateForm() && this.validateAccountSignedIn()) {
        this.setState({ saving: true, })
        if (this.state.phoneRequired) {
          updateTenantPhone({
            tenant_id: this.props.tenant_profile.tenant_id,
            phone: this.state.phone,
          })
        }
        if (this.state.emailRequired) {
          updateTenantEmail({
            tenant_id: this.props.tenant_profile.tenant_id,
            email: this.state.email,
          })
        }
        insertTenantInquiry({
          tenant_id: this.props.tenant_profile.tenant_id,
          group_id: null,
          building_id: this.props.building.building_id,
          suite_id: this.props.suite ? this.props.suite.suite_id : null,
          group_notes: this.state.group_notes,
          group_size: this.state.group_size,
        })
        .then((data) => {
          inquiry_id = data.inquiry_id
          return getLandlordInfo(this.props.building.building_id)
        })
        .then((data) => {
          if (data.corporate_landlord) {
            // send email to landlord to select time slot,
            // send email + sms to tenant, an agent will contact him/her shortly

            return sendInitialCorporateInquiry({
              tenant: {
                tenant_id: this.props.tenant_profile.tenant_id,
                first_name: this.props.tenant_profile.first_name,
                last_name: this.props.tenant_profile.last_name,
                phone: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : this.state.phone,
                email: this.props.tenant_profile.email ? this.props.tenant_profile.email : this.state.email,
              },
              building: {
                building_id: this.props.building.building_id,
                building_alias: this.props.building.building_alias,
                building_address: this.props.building.building_address,
              },
              suite: this.props.suite && this.props.suite.suite_id ? {
                suite_id: this.props.suite.suite_id,
                suite_alias: this.props.suite.suite_alias,
              } : null,
              corporation: {
                corporation_id: data.corporation_id,
                corporation_email: data.email,
                corporation_name: data.corporation_name,
              },
              group: {
                group_notes: this.state.group_notes,
                group_size: this.state.group_size,
              },
              inquiry_id: inquiry_id,
            })
          } else {
            return sendInitialMessage({
              tenant_id: this.props.tenant_profile.tenant_id,
              first_name: this.props.tenant_profile.first_name,
              last_name: this.props.tenant_profile.last_name,
              email: this.state.emailRequired ? this.state.email : this.props.tenant_profile.email,
              phone: this.state.phoneRequired ? this.state.phone : this.props.tenant_profile.phone,
              group_size: this.state.group_size,
              building_id: this.props.building.building_id,
              building_address: this.props.building.building_address,
              building_alias: this.props.building.building_alias,
              suite: this.props.suite && this.props.suite.suite_id ? {
                suite_id: this.props.suite.suite_id,
                suite_alias: this.props.suite.suite_alias,
              } : null,
              group_notes: this.state.group_notes,
            })
          }
        })
        .then((data) => {
          this.setState({
            saving: false,
            submitted: true,
          })
          res()
        })
        .catch((err) => {
          _LTracker.push({
            'error': err,
            'tag' : `${localStorage.getItem('tenant_id')}`
          })
          this.setState({
            error_messages: ['An error as occurred, please Send us a Message'],
            saving: false,
          })
          rej('An error as occurred, please Send us a Message')
        })
      } else {
        rej()
      }
    })
    return p
  }

  sendInquiryBasedOnAuthenticationStatus() {
    this.setState({
      error_messages: [],
      saving: true,
    })
    if (this.state.tenant_loaded) {
      this.sendMessageToBothParties()
    } else if (this.validateForm()) {
      verifyPhone(this.state.phone)
      .then((data) => {
        this.setState({
          phoneError: false,
          phone: data.formattedNumber,
        }, () => {
            checkIfAccountWithPhoneAndEmailExistsAlready(this.state.phone, this.state.email)
            .then((data) => {
              if (data.exists) {
          			this.setState({
          				error_messages: [],
                  saving: false,
                  application_step: 'account_exists',
          			})
              } else {
          			this.setState({
          				error_messages: [],
                  saving: false,
                  application_step: 'ask_for_password',
          			})
              }
            }).catch((err) => {
              // console.log(err)
            })
          })
        })
        .catch((err) => {
          this.setState({
            phoneError: true,
            saving: false,
            error_messages: [err.response.data],
          })
        })
    } else {
      // this.setState({
      //   error_messages: ['Missing name, phone or email necessary for creating a new account'],
      //   saving: false,
      // })
    }
  }

  // submit registration to AWS Cognito
	submitAccountRegistration({ first_name, last_name, password, phone, email }) {
    if (this.state.password && this.state.password.length > 7 && this.state.password === this.state.password_confirmation) {
      this.setState({
        registration_loading: true,
      })
  		// submit registration to AWS Cognito
  		RegisterStudent({ first_name, last_name, password, phone_number: phone, email }).then(({ cognito_id }) => {
  			// save the email to localStorage for future reference
  			localStorage.setItem('RentHero_Tenant_Email', email)
  			// send registration info object to node server
  			const registerJSON = {
  				tenant_id: cognito_id,
  				email,
  				first_name,
  				last_name,
  				phone,
  			}
  			return sendRegisterInfo(registerJSON)
  		}).then((data) => {
  			this.setState({
          error_messages: [],
          application_step: 'ask_for_verification_pin',
  			})
  		})
      .catch((err) => {
        // console.log(err)
  			_LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
  			this.setState({
  				registration_loading: false,
  				error_messages: [err.message],
  			})
  		})
    } else {
      this.setState({
        error_messages: ['Password not long enough or do not match']
      })
    }
	}

  verifyAccountRegistrationPIN() {
    if (this.state.verification_pin && this.state.verification_pin.length > 0) {
      this.setState({
        verification_pin_loading: true,
        error_messages: [],
      })
      VerifyAccount({ email: this.state.email, pin: this.state.verification_pin }).then(() => {
        return LoginStudent({
          email: this.state.email,
          password: this.state.password,
        })
        // this.toggleModal(true, 'login')
      }).then((data) => {
        // reflect successful login in UI
        this.setState({
          application_step: 'pin_verified',
        })
        // get the full staff details using the staff_id from AWS Cognito
        return getTenantProfile({ tenant_id: data.sub })
      }).then((tenantData) => {
        // save the authenticated staff to Redux state
        this.props.saveTenantToRedux(tenantData)
        this.setState({
          tenant_loaded: true
        })
        return Promise.resolve()
      }).then(() => {
        setTimeout(() => {
          this.sendMessageToBothParties()
        }, 500)
      }).catch((err) => {
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
        this.setState({
          verification_pin_loading: false,
          error_messages: [err.message],
        })
      })
    } else {
      this.setState({
        error_messages: ['Please enter a pin'],
      })
    }
  }

  sendInquiryAfterLogin() {
    this.setState({
      application_step: 'pin_verified',
    })
    setTimeout(() => {
      this.setState({
        tenant_loaded: true,
      }, () => this.sendMessageToBothParties())
    }, 300)
  }

  resendPIN(state) {
    this.setState({
      verification_pin_loading: true,
    })
		// send account verification PIN for AWS Cognito
		resetVerificationPIN(state)
			.then(() => {
				this.setState({
					// errorMessage: `Your PIN has been verified to ${this.state.email}. Be sure to check the spam folder just in case.`
					error_messages: [`Your PIN has been re-sent to your phone.`],
          verification_pin_loading: false,
				})
			})
			.catch((err) => {
				_LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
				// console.log(err.message)
				this.setState({
					error_messages: [err.message],
          verification_pin_loading: false,
				})
			})
	}

  renderAskForPassword() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Header as='h2' icon='user' content='Almost there!' subheader='Set a password for your account' />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80%' }}>
          <Form.Field style={{ width: '100%' }}>
            <Input value={this.state.password} onChange={(e) => this.updateAttr(e, 'password')} type='password' placeholder='Password' style={{ width: '100%' }} />
          </Form.Field>
          <br/>
          <Form.Field style={{ width: '100%' }}>
            <Input value={this.state.password_confirmation} onChange={(e) => this.updateAttr(e, 'password_confirmation')} type='password' placeholder='Confirm Password' style={{ width: '100%' }} />
          </Form.Field>
          <br/>
          <Form.Field style={{ width: '100%' }}>
            {
              this.state.error_messages.map((err, index) => {
                return (
                  <Message
                    visible
                    key={index}
                    error
                    content={err}
                  />
                )
              })
            }
          </Form.Field>
          <br/>
          <Form.Field style={{ width: '100%' }}>
            <Button primary loading={this.state.registration_loading} onClick={() => this.submitAccountRegistration(this.state)} style={{ width: '100%' }}>SAVE PASSWORD</Button>
            {
              this.state.error_messages.length > 0
              ?
              <Button loading={this.state.registration_loading} onClick={() => this.setState({ application_step: '' })} style={{ width: '100%' }}>BACK</Button>
              :
              null
            }
          </Form.Field>
        </div>
      </div>
    )
  }

  askForVerificationPIN() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Header as='h2' icon='user' content='Verify Account' subheader='Check your phones text messages' />
        <Form style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80%' }}>
          <Form.Field style={{ width: '80%' }}>
            <Input id='pin_input' value={this.state.verification_pin} onChange={(e) => this.updateAttr(e, 'verification_pin')} type='text' placeholder='Verification PIN' style={{ width: '100%' }} />
          </Form.Field>
          <Form.Field style={{ width: '80%' }}>
            {
              this.state.error_messages.map((err, index) => {
                return (
                  <Message
                    visible
                    key={index}
                    error
                    content={err}
                  />
                )
              })
            }
          </Form.Field>
          <Form.Field style={{ width: '80%' }}>
            <Button primary loading={this.state.verification_pin_loading} onClick={() => this.verifyAccountRegistrationPIN(this.state.verification_pin)} style={{ width: '100%' }}>VERIFY ACCOUNT</Button>
            <br/>
            <span onClick={() => this.resendPIN(this.state)}>Resend PIN</span>
          </Form.Field>
        </Form>
      </div>
    )
  }

  successfulPinVerificationAndInquiriesSent() {
    return (
      <Form>
        <Form.Field>
          {
            this.state.error_messages.map((err, index) => {
              return (
                <Message
                  visible
                  key={index}
                  error
                  content={err}
                />
              )
            })
          }
        </Form.Field>
        <Form.Field>
          {
            this.state.submitted
            ?
            <Message positive>
              <Header>
                <Icon name='checkmark' color='green' />
                <Header.Content>Message Sent to Landlord</Header.Content>
                <Header.Subheader>You can now communicate with the landlord via SMS or Email</Header.Subheader>
              </Header>
            </Message>
            :
            <Segment style={{ minHeight: '300px', }}>
              <Dimmer active inverted>
                <Loader inverted>Sending Message to Landlord...</Loader>
              </Dimmer>
            </Segment>
          }
        </Form.Field>
      </Form>
    )
  }

  accountAlreadyExistsOptions() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Header as='h2' icon='user' content='An account with this email or phone already exists' subheader='If you forgot your password, it only takes 30 seconds to reset it with your phone' />
        <div style={{ width: '80%' }}>
          <br/><br/>
          {/*          <Button primary onClick={() => this.props.history.push('/login')} style={{ width: '100%' }}>LOG IN</Button>
          <br/><br/>
          <Button primary onClick={() => this.props.history.push('/login/forgot')} style={{ width: '100%' }}>FORGOT PASSWORD</Button>*/}
          {
            this.state.forgot_password
            ?
            <ForgotPassword
              backToLogin={() => this.setState({ forgot_password: false, })}
            />
            :
            <Login
              forgotPassword={() => this.setState({ forgot_password: true, })}
              closeModal={() => this.sendInquiryAfterLogin()}
              ignore_signup
            />
          }
        </div>
      </div>
    )
  }

	render() {
    // for when an unsigned user submits an application
    // we do not send the inquiry out yet, in this.sendInquiryBasedOnAuthenticationStatus() we first check if an account with that email or phone exists already
    // if it already exists, we set this.state.application_step === 'pin_verified' || 'account_exists'
    // if not, then ask for a password by setting this.state.application_step === 'ask_for_password'
    if (this.state.application_step === 'ask_for_password') {
      return this.renderAskForPassword()
    } else if (this.state.application_step === 'ask_for_verification_pin') {
      // when this.askForVerificationPIN() successfully verifies a pin, we also run this.sendMessageToBothParties()
      return this.askForVerificationPIN()
    } else if (this.state.application_step === 'pin_verified') {
      // success message
      return this.successfulPinVerificationAndInquiriesSent()
    } else if (this.state.application_step === 'account_exists') {
      // give option to log in or reset password
      // log in --> redirect to /login
      // forgot password --> redirect to /forgot password
      return this.accountAlreadyExistsOptions()
    } else {
  		return (
  			<div id='MessageLandlordForm' style={comStyles().container}>
          {
            this.props.header === 'Apply Now'
            ?
            <Header as='h2' icon='suitcase' content={`Applying to ${this.props.building.building_alias} ${this.props.suite && this.props.suite.suite_alias ? this.props.suite.suite_alias : ''}`} subheader='Send an Inquiry and chat with the landlord' />
            :
            <Header as='h2' icon='phone' content={`Message Landlord about ${this.props.building.building_alias} ${this.props.suite && this.props.suite.suite_alias ? this.props.suite.suite_alias : ''}`} subheader='A chat thread will be opened between you and the landlord' />
          }
          {
            this.state.office_hours && this.state.office_hours_ended
            ?
            <Header
              as='h3'
              icon='wait'
              content={`Office Hours for this landlord are from ${moment(this.state.office_hours.office_hours_start, 'HHmm').format('h:mm a')} to ${moment(this.state.office_hours.office_hours_end, 'HHmm').format('h:mm a')}`}
              subheader='You can still send a message, the landlord will respond during office hours'
            />
            :
            null
          }
          <br />
          <Form>
            {
              this.state.tenant_loaded
              ?
              null
              :
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>First Name</label>
                  <Input
                    value={this.state.first_name}
                    onChange={e => this.updateAttr(e, 'first_name')}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <Input
                    value={this.state.last_name}
                    onChange={e => this.updateAttr(e, 'last_name')}
                  />
                </Form.Field>
              </Form.Group>
            }

            <Form.Group widths='equal'>
              <Form.Field>
                <label>Phone Number</label>
                <Input
                  type='phone'
                  value={this.state.phone}
                  onChange={e => this.updateAttr(e, 'phone')}
                  disabled={!this.state.phoneRequired}
                  error={this.state.phoneError}
                />
              </Form.Field>
              <Form.Field>
                <label>Email Address</label>
                <Input
                  value={this.state.email}
                  onChange={e => this.updateAttr(e, 'email')}
                  disabled={!this.state.emailRequired}
                />
              </Form.Field>
            </Form.Group>


            <Form.Field>
              <label>Group Size</label>
              <Dropdown
                id='Group Size'
                placeholder='Select your Group Size'
                value={this.state.group_size}
                selection
                options={this.group_size_options}
                onChange={(e, d) => { this.updateGroupSize(e, d, 'group_size') }}
              />
            </Form.Field>
            <Form.Field>
              <label>Message</label>
              <TextArea
                rows={3}
                value={this.state.group_notes}
                placeholder='When are you available for a tour?'
                onChange={e => this.setState({ group_notes: e.target.value })}
                style={comStyles().textArea}
              />
            </Form.Field>
            <br />
            {
              this.state.emailRequired || this.state.phoneRequired
              ?
              <Form.Field style={{ display: 'flex', flexDirection: 'row' }}>
                <Checkbox
                  checked={this.state.acknowledge}
                  onChange={() => this.setState({ acknowledge: !this.state.acknowledge })}
                />
                <label style={{ marginLeft: '10px' }}>I acknowledge that my information is accurate & agree to the <a href={`${window.location.origin}/termsandconditions`} target='_blank'>terms and conditions</a></label>
              </Form.Field>
              :
              null
            }

            <Form.Field>
              {
                this.state.error_messages.map((err, index) => {
                  return (
                    <Message
                      visible
                      key={index}
                      error
                      content={err}
                    />
                  )
                })
              }
            </Form.Field>
            <Form.Field>
              {
                this.state.submitted
                ?
                <Message positive>
                  <Header>
                    <Icon name='checkmark' color='green' />
                    <Header.Content>Message Sent to Landlord</Header.Content>
                    <Header.Subheader>You can now communicate with the landlord via SMS or Email</Header.Subheader>
                  </Header>
                </Message>
                :
                <Button
                  fluid
                  primary
                  loading={this.state.saving}
                  disabled={this.state.saving}
                  content='Send Message'
                  onClick={() => this.sendInquiryBasedOnAuthenticationStatus()}
                />
              }
            </Form.Field>
          </Form>
  			</div>
  		)
    }
	}
}

// defines the types of variables in this.props
MessageLandlordForm.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
  suite: PropTypes.object,                  // passed in
	closeModal: PropTypes.func.isRequired,		// passed in
  landlord: PropTypes.object.isRequired,    // passed in
  header: PropTypes.string.isRequired,      // passed in
  saveTenantToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
MessageLandlordForm.defaultProps = {
  suite: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MessageLandlordForm)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveTenantToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      margin: '20px',
		}
	}
}

// Compt for copying as a UberSignup
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Button,
  Form,
  Dropdown,
  Checkbox,
  Input,
  TextArea,
  Message,
  Radio,
} from 'semantic-ui-react'
import InputRange from 'react-input-range'
require('../../../styles/react-input-range.css')
import { loginFacebook, insertUser, initiateFacebook } from '../../../api/auth/facebook_auth'
import { saveTenantToRedux, triggerForcedSignin } from '../../../actions/auth/auth_actions'
import { saveTenantProfile, getTenantProfile } from '../../../api/auth/tenant_api'


class UberSignup extends Component {

  constructor() {
    super()
    this.state = {
      application: {
        first_name: '',
        last_name: '',
        school: '',
        gender: '',
        program_and_term: '',
        email: '',
        phone: '',
        ideal_place_desc: '',
        room: {
  				min: 1,
  				max: 5,
  			},
        price: {
  				min: 500,
  				max: 900,
  			},
        ensuite: false,
        ok_match_with_randoms: true,
      },
      error_messages: [],
      submitted: false,
    }
  }

  updateApplicationAttr(e, attr) {
    this.setState({
      application: {
        ...this.state.application,
        [attr]: e.target.value
      }
    })
  }

  loginWithFacebook() {
    localStorage.removeItem('fbToken')
    initiateFacebook()
    .then(() => {
      return loginFacebook()
    })
    .then((fbProfile) => {
      insertUser(fbProfile)
      return saveTenantProfile(fbProfile)
    })
    .then((data) => {
      return getTenantProfile({ tenant_id: data.tenant_id, })
    })
    .then((data) => {
      this.props.saveTenantToRedux(data)
    })
  }

  generateForm() {
    return (
      <div style={comStyles().body}>
        <Form style={comStyles().form}>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>First Name</label>
              <Input
                value={this.state.application.first_name}
                onChange={(e) => this.updateApplicationAttr(e, 'first_name')}
                disabled={this.state.submitted}
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input
                value={this.state.application.last_name}
                onChange={(e) => this.updateApplicationAttr(e, 'last_name')}
                disabled={this.state.submitted}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field style={comStyles().row_field}>
            <Radio
              label='Male'
              name='gender'
              value='Male'
              checked={this.state.application.gender === 'Male'}
              onChange={(e, d) => this.updateApplicationAttr({ target: { value: 'Male' } }, 'gender')}
              disabled={this.state.submitted}
            />
            &nbsp; &nbsp;
            <Radio
              label='Female'
              name='gender'
              value='Female'
              checked={this.state.application.gender === 'Female'}
              onChange={(e, d) => this.updateApplicationAttr({ target: { value: 'Female' } }, 'gender')}
              disabled={this.state.submitted}
            />
          </Form.Field>
          <Form.Group widths='equal' >
            <Form.Field>
              <label>School</label>
              <Dropdown
                id='school'
                placeholder='School'
                value={this.state.application.school}
                selection
                options={this.state.school_options}
                onChange={(e, d) => { this.updateApplicationType(e, d, 'school') }}
                disabled={this.state.submitted}
              />
            </Form.Field>
            <Form.Field>
              <label>Program, and Term</label>
              <Input
                value={this.state.application.program_and_term}
                onChange={(e) => this.updateApplicationAttr(e, 'program_and_term')}
                disabled={this.state.submitted}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Email</label>
            <Input
              value={this.state.application.email}
              onChange={(e) => this.updateApplicationAttr(e, 'email')}
              disabled={this.state.submitted}
            />
          </Form.Field>
          <Form.Field>
            <label>Phone</label>
            <Input
              value={this.state.application.phone}
              onChange={(e) => this.updateApplicationAttr(e, 'phone')}
              disabled={this.state.submitted}
            />
          </Form.Field>
          <Form.Field>
            <label>Describe Your Ideal Place</label>
            <TextArea
              rows={4}
              value={this.state.ideal_place_desc}
              placeholder='Eg. Give as much info as possible. Which suites we you ok with? Will your group change? Do you want the landlord to match you with only female roommates? ...etc'
              onChange={(e) => this.setState({ ideal_place_desc: e.target.value })}
              style={comStyles().textArea}
            />
          </Form.Field>
          <Form.Field>
  					<div style={comStyles().label}>
  						<h6>Price Range</h6>
  					</div>
            <div style={comStyles().slider}>
  						<InputRange
  							step={5}
  		          maxValue={1200}
  		          minValue={300}
  		          formatLabel={(value) => `$${value >= 1200 ? '1200+' : value}`}
  		          value={this.state.application.price}
  		          onChange={(value) => this.updateApplicationAttr({ target: { value: value } }, 'price')}
  						/>
  					</div>
          </Form.Field>
          <Form.Field>
  					<div style={comStyles().label}>
  						<h6>Rooms Range</h6>
  					</div>
            <div style={comStyles().slider}>
  						<InputRange
  							step={1}
  		          maxValue={15}
  		          minValue={0}
  		          formatLabel={(value) => value}
  		          value={this.state.application.room}
  		          onChange={(value) => this.updateApplicationAttr({ target: { value: value } }, 'room')}
  						/>
  					</div>
          </Form.Field>
          <Form.Field>
            <Checkbox
              label='Ensuite Bath'
              name='ensuite'
              checked={this.state.application.ensuite}
              onChange={(e, d) => {console.log(d); this.updateApplicationAttr({ target: { value: d.checked } }, 'ensuite')}}
              disabled={this.state.submitted}
            />
            &nbsp; &nbsp;
            <Checkbox
              label='Ok With Randoms'
              name='randoms'
              checked={this.state.application.ok_match_with_randoms}
              onChange={(e, d) => this.updateApplicationAttr({ target: { value: d.checked } }, 'ok_match_with_randoms')}
              disabled={this.state.submitted}
            />
          </Form.Field>
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
            <Button
              onClick={() => this.setState({ submitted: true })}
              content='Save'
              icon='send'
            />
          </Form.Field>
        </Form>
      </div>
    )
  }

  renderUberStatus() {
    return (
      <div>
        YOU HAVE ALREADY REDEEMED YOUR UBER CODE
      </div>
    )
  }

	render() {
		return (
			<div id='UberSignup' style={comStyles().container}>
        <Header
          icon='car'
          content='Every Signup Gets 1 FREE Uber!'
          subheader='Take a tour of your favorite property'
        />
        {
          this.props.authenticated
          ?
          this.renderUberStatus()
          :
          <div>
            {
              this.state.submitted
              ?
              <Form.Field>
                <div style={comStyles().label}>
                  <h4>Last Step</h4>
                </div>
                <Button
                  onClick={() => this.loginWithFacebook()}
                  content='Login with Facebook'
                  color='facebook'
                  icon='facebook'
                />
              </Form.Field>
              :
              this.generateForm()
            }
          </div>
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
UberSignup.propTypes = {
	history: PropTypes.object.isRequired,
  saveTenantToRedux: PropTypes.func.isRequired,
  authenticated: PropTypes.bool,
}

// for all optional props, define a default value
UberSignup.defaultProps = {
  authenticated: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(UberSignup)

// Get access to state from the Redux store
const mapReduxToProps = (state) => {
	return {
    authenticated: state.auth.authenticated,
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
      height: 'auto',
      width: '100vw',
      padding: '20px',
      justifyContent: 'center',
      alignItems: 'center',
		}
	}
}

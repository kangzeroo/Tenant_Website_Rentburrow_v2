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
import { updateEntireTenantProfile, } from '../../../api/auth/tenant_api'
import { sendInitialMessage, } from '../../../api/sms/sms_api'

class MessageLandlordForm extends Component {

  constructor() {
    super()
    this.state = {
      tenant_profile: {
        first_name: '',
        last_name: '',
        legal_name: '',
        gender: '',
        email: '',
        phone: '',
        date_of_birth: '',
        school: '',
        program: '',
        current_semester: '',
        group_size: 1,
      },
      group_notes: '',
      acknowledge: false,

      saving: false,
      submitted: false,

      error_messages: [],
    }
    this.school_options = [
      { key: 'uw', text: 'University of Waterloo', value: 'University of Waterloo' },
      { key: 'wlu', text: 'Wilfrid Laurier University', value: 'Wilfrid Laurier University' },
      { key: 'conestoga', text: 'Conestoga College', value: 'Conestoga College' },
      { key: 'other', text: 'Other', value: 'Other' },
    ]
    this.group_size_options = [
      { key: 'unknown', text: 'Unknown', value: 0 },
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
    this.setState({
      tenant_profile: {
        first_name: this.props.tenant_profile.first_name ? this.props.tenant_profile.first_name : '',
        last_name: this.props.tenant_profile.last_name ? this.props.tenant_profile.last_name : '',
        legal_name: this.props.tenant_profile.legal_name ? this.props.tenant_profile.legal_name : '',
        gender: this.props.tenant_profile.gender ? this.props.tenant_profile.gender : '',
        email: this.props.tenant_profile.email ? this.props.tenant_profile.email : '',
        phone: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : '',
        date_of_birth: this.props.tenant_profile.date_of_birth ? this.props.tenant_profile.date_of_birth : moment().format('L'),
        school: this.props.tenant_profile.school ? this.props.tenant_profile.school : '',
        program: this.props.tenant_profile.program ? this.props.tenant_profile.program : '',
        current_semester: this.props.tenant_profile.current_semester ? this.props.tenant_profile.current_semester : '',
      }
    })
  }

  updateTenantState(e, attr) {
    this.setState({
      tenant_profile: {
        ...this.state.tenant_profile,
        [attr]: e.target.value,
      }
    })
  }

  updateApplicationType(e, data, attr) {
    this.setState({
      tenant_profile: {
        ...this.state.tenant_profile,
        [attr]: data.value,
      }
    })
  }

  updateDateType(e, data, attr) {
    this.setState({
      tenant_profile: {
        ...this.state.tenant_profile,
        [attr]: moment(data).format('L'),
      }
    }, () => console.log(this.state.tenant_profile.date_of_birth))
  }

  validateForm() {
    let ok_to_proceed = true
    const error_messages = []
    if (this.state.tenant_profile.first_name.length === 0 || this.state.tenant_profile.last_name.length === 0) {
      error_messages.push('Your name fields are incomplete')
      ok_to_proceed = false
    }
    if (this.state.tenant_profile.gender.length === 0) {
      error_messages.push('Please select a gender')
      ok_to_proceed = false
    }
    if (this.state.tenant_profile.program.length === 0 || this.state.tenant_profile.current_semester.length === 0 || this.state.tenant_profile.school.length === 0) {
      error_messages.push('Please enter your school, program, and term')
      ok_to_proceed = false
    }
    if (!this.state.tenant_profile.group_size) {
      error_messages.push('You must specify a group size')
      ok_to_proceed = false
    }
    if (!validateEmail(this.state.tenant_profile.email)) {
      error_messages.push('The email address entered is not valid')
      ok_to_proceed = false
    }
    if (this.state.tenant_profile.email.length === 0 || this.state.tenant_profile.phone.length === 0) {
      error_messages.push('You must enter your email and phone number')
      ok_to_proceed = false
    }
    if (this.state.group_notes.length === 0) {
      error_messages.push('Please enter a Message')
      ok_to_proceed = false
    }
    if (!this.state.acknowledge) {
      error_messages.push('Please acknowledge your information')
      ok_to_proceed = false
    }
    this.setState({
      error_messages: error_messages,
      submitted: false,
    })
    return ok_to_proceed
  }

  sendMessageToBothParties() {
    if (this.validateForm(this.state.tenant_profile)) {
      this.setState({ saving: true, })
      const tenantObj = {
        tenant_id: this.props.tenant_profile.tenant_id,
        first_name: this.state.tenant_profile.first_name,
        last_name: this.state.tenant_profile.last_name,
        legal_name: this.state.tenant_profile.legal_name,
        gender: this.state.tenant_profile.gender,
        email: this.state.tenant_profile.email,
        phone: this.state.tenant_profile.phone,
        date_of_birth: moment(this.state.tenant_profile.date_of_birth).format('L'),
        school: this.state.tenant_profile.school,
        program: this.state.tenant_profile.program,
        year: this.state.tenant_profile.current_semester,
      }
      updateEntireTenantProfile(tenantObj)
      .then((data) => {
        return insertTenantInquiry({
          tenant_id: this.props.tenant_profile.tenant_id,
          group_id: null,
          building_id: this.props.building.building_id,
          group_notes: this.state.group_notes,
          group_size: this.state.tenant_profile.group_size,
        })
      })
      .then((data) => {
        return sendInitialMessage({
          id: data.inquiry_id,
          tenant_id: this.props.tenant_profile.tenant_id,
          first_name: this.state.tenant_profile.first_name,
          last_name: this.state.tenant_profile.last_name,
          gender: this.state.tenant_profile.gender,
          school: this.state.tenant_profile.school,
          program_and_term: [this.state.tenant_profile.program, this.state.tenant_profile.current_semester].join(', '),
          email: this.state.tenant_profile.email,
          phone: this.state.tenant_profile.phone,
          group_size: this.state.tenant_profile.group_size,
          building_id: this.props.building.building_id,
          building_address: this.props.building.building_address,
          building_alias: this.props.building.building_alias,
          group_notes: this.state.group_notes,
        })
      })
      .then((data) => {
        this.setState({
          saving: false,
          submitted: true,
        })
      })
      .catch((err) => {
        this.setState({
          error_messages: ['An error as occurred, please Send us a Message'],
          saving: false,
        })
      })
    }
  }

	render() {
		return (
			<div id='MessageLandlordForm' style={comStyles().container}>
				<Header as='h2' icon='phone' content='Message Landlord' subheader='Please confirm your information before a chat thread is opened between you and the landlord' />
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>First Name</label>
              <Input
                value={this.state.tenant_profile.first_name}
                onChange={e => this.updateTenantState(e, 'first_name')}
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <Input
                value={this.state.tenant_profile.last_name}
                onChange={e => this.updateTenantState(e, 'last_name')}
              />
            </Form.Field>
            <Form.Field>
              <label>Full Legal Name</label>
              <Input
                value={this.state.tenant_profile.legal_name}
                onChange={e => this.updateTenantState(e, 'legal_name')}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Phone Number</label>
              <Input
                value={this.state.tenant_profile.phone}
                onChange={e => this.updateTenantState(e, 'phone')}
              />
            </Form.Field>
            <Form.Field>
              <label>Email Address</label>
              <Input
                value={this.state.tenant_profile.email}
                onChange={e => this.updateTenantState(e, 'email')}
              />
            </Form.Field>
            <Form.Field>
              <label>Date of Birth</label>
              <LocaleProvider locale={enUS}>
                <DatePicker
                  value={moment(this.state.tenant_profile.date_of_birth, 'MM/DD/YYYY')}
                  format={'MM/DD/YYYY'}
                  onChange={(date, dateString) => this.updateDateType(date, dateString, 'date_of_birth')}
                  size='large'
                  placeholder='Select your birthday'
                  allowClear
                  autoFocus
                />
              </LocaleProvider>
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>School</label>
              <Dropdown
                id='school'
                placeholder='School'
                value={this.state.tenant_profile.school}
                selection
                options={this.school_options}
                onChange={(e, d) => { this.updateApplicationType(e, d, 'school') }}
              />
            </Form.Field>
            <Form.Field>
              <label>Program</label>
              <Input
                value={this.state.tenant_profile.program}
                onChange={e => this.updateTenantState(e, 'program')}
              />
            </Form.Field>
            <Form.Field>
              <label>Current Semester</label>
              <Input
                value={this.state.tenant_profile.current_semester}
                onChange={e => this.updateTenantState(e, 'current_semester')}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>My Gender</label>
              <Dropdown
                id='Group Size'
                placeholder='Select your Gender'
                value={this.state.tenant_profile.gender}
                selection
                options={this.gender_options}
                onChange={(e, d) => { this.updateApplicationType(e, d, 'gender') }}
              />
            </Form.Field>
            <Form.Field>
              <label>Group Size</label>
              <Dropdown
                id='Group Size'
                placeholder='Select your Group Size'
                value={this.state.tenant_profile.group_size}
                selection
                options={this.group_size_options}
                onChange={(e, d) => { this.updateApplicationType(e, d, 'group_size') }}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Message</label>
            <TextArea
              rows={3}
              value={this.state.group_notes}
              placeholder='Eg. Give as much info as possible. Which suites we you ok with? Will your group change? Do you want a tour? ...etc'
              onChange={e => this.setState({ group_notes: e.target.value })}
              style={comStyles().textArea}
            />
          </Form.Field>
          <Form.Field style={{ display: 'flex', flexDirection: 'row' }}>
            <Checkbox
              checked={this.state.acknowledge}
              onChange={() => this.setState({ acknowledge: !this.state.acknowledge })}
            />
            <label style={{ marginLeft: '10px'}} >I acknowledge that my information is accurate, send my message to the landlord</label>
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
                onClick={() => this.sendMessageToBothParties()}
              />
            }
          </Form.Field>
        </Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
MessageLandlordForm.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  building: PropTypes.object.isRequired,    // passed in
	closeModal: PropTypes.func.isRequired,		// passed in
  landlord: PropTypes.object.isRequired,    // passed in
}

// for all optional props, define a default value
MessageLandlordForm.defaultProps = {

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

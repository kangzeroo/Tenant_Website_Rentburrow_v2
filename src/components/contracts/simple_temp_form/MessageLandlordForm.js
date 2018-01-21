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
import { updateEntireTenantProfile, updateTenantPhone, updateTenantEmail, } from '../../../api/auth/tenant_api'
import { sendInitialMessage, sendTenantWaitMsg, } from '../../../api/sms/sms_api'
import { getLandlordInfo, } from '../../../api/search/search_api'

class MessageLandlordForm extends Component {

  constructor() {
    super()
    this.state = {

      phoneRequired: false,
      emailRequired: false,

      phone: '',
      email: '',

      group_size: 1,
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
    if (!this.props.tenant_profile.phone || this.props.tenant_profile.phone.length === 0) {
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
    this.setState({
      error_messages: error_messages,
      submitted: false,
    })
    return ok_to_proceed
  }

  sendMessageToBothParties() {
    let inquiry_id
    if (this.validateForm()) {
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
          return sendTenantWaitMsg({
            tenant: {
              tenant_id: this.props.tenant_profile.tenant_id,
              first_name: this.props.tenant_profile.first_name,
              last_name: this.props.tenant_profile.last_name,
              phone: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : this.state.phone,
            },
            building: {
              building_id: this.props.building.building_id,
              building_alias: this.props.building.building_alias,
              building_address: this.props.building.building_address,
            },
            group_notes: this.state.group_notes,
            group_size: this.state.group_size,
            corporation_id: data.corporation_id,
            corporation_email: data.email,
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
            group_notes: this.state.group_notes,
          })
        }
      })
      .then((data) => {
        this.setState({
          saving: false,
          submitted: true,
        })
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
      })
    }
  }

	render() {
		return (
			<div id='MessageLandlordForm' style={comStyles().container}>
        {
          this.props.header === 'Apply Now'
          ?
          <Header as='h2' icon='suitcase' content='Apply Now' subheader='Send an Inquiry and chat with the landlord' />
          :
          <Header as='h2' icon='phone' content='Message Landlord' subheader='A chat thread will be opened between you and the landlord' />
        }
        <br />
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Phone Number</label>
              <Input
                value={this.state.phone}
                onChange={e => this.updateAttr(e, 'phone')}
                disabled={!this.state.phoneRequired}
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

          {
            this.state.emailRequired || this.state.phoneRequired
            ?
            <Form.Field style={{ display: 'flex', flexDirection: 'row' }}>
              <Checkbox
                checked={this.state.acknowledge}
                onChange={() => this.setState({ acknowledge: !this.state.acknowledge })}
              />
              <label style={{ marginLeft: '10px'}} >I acknowledge that my information is accurate, send my message to the landlord</label>
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
  header: PropTypes.string.isRequired,      // passed in
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

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
  Dropdown,
  Radio,
  Input,
  TextArea,
  Button,
  Message,
} from 'semantic-ui-react'
import { getLandlordInfo } from '../../../api/search/search_api'

class PhoneTestForm extends Component {

  constructor() {
    super()
    this.state = {
      application_template: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        notes: '',
      },

			error_messages: [],
			submitted: false,
      sucessful: false,

      landlord: {},
      show_immediately: false,
      loading: false,

      tenant_inquiry: {},
    }
  }

  componentWillMount() {
    console.log(this.props.building)

  }

  sendMessageToLandlord() {
    getLandlordInfo(this.props.building.building_id)
    .then((data) => {
      const obj = {
        tenant_phone: this.state.application_template.phone,
        landlord_phone: data.phone,
        notes: this.state.application_template.notes,
      }
      return insertTenantLandlordSMS(obj)
    })
  }

  updateApplicationAttr(e, attr) {
    this.setState({
      application_template: {
        ...this.state.application_template,
        [attr]: e.target.value,
      }
    })
  }

  updateApplicationType(e, data, attr) {
    this.setState({
      application_template: {
        ...this.state.application_template,
        [attr]: data.value,
      }
    })
  }

	render() {
		return (
			<div id='PhoneTestForm' style={comStyles().container}>
        <div style={comStyles().title}>
          Give The Landlord Permission To Call Back
        </div>
        <div style={comStyles().body}>
          <Form style={comStyles().form}>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>First Name</label>
                <Input
                  value={this.state.application_template.first_name}
                  onChange={(e) => this.updateApplicationAttr(e, 'first_name')}
                  disabled={this.state.submitted}
                />
              </Form.Field>
              <Form.Field>
                <label>Last Name</label>
                <Input
                  value={this.state.application_template.last_name}
                  onChange={(e) => this.updateApplicationAttr(e, 'last_name')}
                  disabled={this.state.submitted}
                />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>Email</label>
              <Input
                value={this.state.application_template.email}
                onChange={(e) => this.updateApplicationAttr(e, 'email')}
                disabled={this.state.submitted}
              />
            </Form.Field>
            <Form.Field>
              <label>Phone</label>
              <Input
                value={this.state.application_template.phone}
                onChange={(e) => this.updateApplicationAttr(e, 'phone')}
                disabled={this.state.submitted}
              />
            </Form.Field>
            <Form.Field>
              <label>Notes For Landlord</label>
              <TextArea
                rows={4}
                value={this.state.application_template.notes}
                placeholder='Eg. Give as much info as possible. Which suites we you ok with? Will your group change? Do you want the landlord to match you with only female roommates? ...etc'
                onChange={(e) => this.updateApplicationAttr(e, 'notes')}
                style={comStyles().textArea}
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

            <Button
              primary
              fluid
              content='Send Message To Landlord'
              onClick={() => this.sendMessageToLandlord()}
            />
          </Form>
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
PhoneTestForm.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
  building: PropTypes.object.isRequired,      // passed in
  closeModal: PropTypes.func.isRequired,      // passed in
  landlord: PropTypes.object.isRequired,      // passed in
}

// for all optional props, define a default value
PhoneTestForm.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PhoneTestForm)

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
		}
	}
}

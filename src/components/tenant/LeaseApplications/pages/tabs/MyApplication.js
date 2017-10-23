// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import {
  Form,
  Card,
  Header,
  Message,
  Icon,
} from 'semantic-ui-react'
import {
  getTenantApplication,
} from '../../../../../api/application/lease_application_api'

class MyApplication extends Component {

  constructor() {
    super()
    this.state = {
      tenant_application: {}
    }
  }

  componentWillMount() {
    getTenantApplication(this.props.tenant_profile.tenant_id, this.props.application_id)
    .then((data) => {
      this.setState({
        tenant_application: data
      })
    })
  }
  renderAboutTenant() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Tenant Profile
				</Card.Header>
				<br />
				<Form.Field>
					<label>First Name</label>
					<input
						value={this.state.tenant_application.first_name}
            disabled
					/>
				</Form.Field>
        <Form.Field>
					<label>Last Name</label>
					<input
						value={this.state.tenant_application.last_name}
            disabled
					/>
				</Form.Field>
				<Form.Field>
					<label>Date Of Birth</label>
					<input
						value={moment(this.state.tenant_application.date_of_birth).format('MMMM Do YYYY')}
            disabled
					/>
				</Form.Field>
				<Form.Field>
					<label>Gender</label>
					<input
						value={this.state.tenant_application.gender}
            disabled
					/>
				</Form.Field>
				<Form.Field>
					<label>Current Address</label>
					<input
						value={this.state.tenant_application.current_address}
            disabled
					/>
				</Form.Field>
			</Card>
		)
	}

	renderGuarantorAndWitness() {
		return (
			<Card raised fluid style={comStyles().card_style}>
				<Card.Header style={comStyles().card_header}>
					Guarantor Information
				</Card.Header>
				<br />
				<Form.Field>
					<label>Guarantor First Name</label>
					<input
						value={this.state.tenant_application.guarantor_first_name}
            disabled
					/>
				</Form.Field>
        <Form.Field>
					<label>Guarantor Last Name</label>
					<input
						value={this.state.tenant_application.guarantor_last_name}
            disabled
					/>
				</Form.Field>
				<Form.Field>
					<label>Relationship to Tenant</label>
					<input
						value={this.state.tenant_application.relationship}
            disabled
					/>
				</Form.Field>
				<Form.Field>
					<label>Guarantor Email</label>
					<input
						value={this.state.tenant_application.guarantor_email}
            disabled
					/>
				</Form.Field>
			</Card>
		)
	}

	render() {
		return (
			<div style={comStyles().container}>
      <Form>
          <Card raised fluid style={comStyles().card_style}>
            <Header
              as='h2'
              icon='book'
              content='Tenant Application'
              subheader='Read Only'
            />
          </Card>
          {
            this.renderAboutTenant()
          }
          {
            this.renderGuarantorAndWitness()
          }
          <Message positive style={comStyles().success_message}>
            <Header
              as='h3'
              icon='checkmark box'
              content='Application Received By Landlord'
              subheader={`Submitted On ${moment(this.state.tenant_application.submitted_at).format('LLL')} EDT`}
            />
          </Message>
        </Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
MyApplication.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object.isRequired,
  application_id: PropTypes.string.isRequired,        // passed in
}

// for all optional props, define a default value
MyApplication.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(MyApplication)

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
		},
    card_style: {
			padding: '20px',
		},
		card_header: {
			fontSize: '1.3rem',
			fontWeight: 'bold',
		},
    success_message: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
	}
}

// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import uuid from 'uuid'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
	Button,
	Message,
	Radio,
	Card,
	TextArea,
	Icon,
} from 'semantic-ui-react'
import { validateEmail } from '../../../api/general/general_api'


class SimpleTermForm extends Component {

	constructor() {
    super()
    this.state = {
      application_template: {
        name: '',
				gender: '',
        school_and_term: '',
        email: '',
        phone: '',
      },
      my_group_may_change: false,
			group_notes: '',
      group_size: 0,
      group_members: [],
			error_messages: [],
			group_error_messages: [],
			submitted: false,
    }
  }

	updateApplicationAttr(e, attr) {
    this.setState({
      application_template: {
        ...this.state.application_template,
        [attr]: e.target.value,
      }
    })
  }

	addToGroup() {
		if (this.validateForm()) {
			this.setState({
				group_members: this.state.group_members.concat([{
					...this.state.application_template,
					id: uuid.v4(),
				}]),
				application_template: {
					name: '',
					gender: '',
	        school_and_term: '',
	        email: '',
	        phone: '',
				},
				error_messages: [],
			})
		}
	}

	removeFromGroup(id) {
		this.setState({
			group_members: this.state.group_members.filter((mem) => {
				return mem.id !== id
			})
		})
	}

	submitApplication() {
		if (this.state.group_members.length > 0) {
			console.log('submitApplication')
			this.setState({
				submitted: true,
				group_error_messages: [],
			})
			setTimeout(() => {
				this.props.closeModal()
			}, 2000)
		} else {
			this.setState({
				group_error_messages: ['You must have at least 1 group member']
			})
		}
	}

	validateForm() {
		let ok_to_proceed = true
		const error_messages = []
		if (this.state.application_template.name.length === 0 || this.state.application_template.gender.length === 0) {
			error_messages.push('You must enter a name and gender')
			ok_to_proceed = false
		}
		if (this.state.application_template.school_and_term.length === 0) {
			error_messages.push('You must enter your school and term')
			ok_to_proceed = false
		}
		if (!validateEmail(this.state.application_template.email)) {
			error_messages.push('The email entered is not valid')
			ok_to_proceed = false
		}
		if (this.state.application_template.email.length === 0 || this.state.application_template.phone.length === 0) {
			error_messages.push('You must enter your email and phone number')
			ok_to_proceed = false
		}
		this.setState({
			error_messages: error_messages,
			submitted: false,
		})
		return ok_to_proceed
	}

	render() {
		return (
			<div style={comStyles().container}>
				<Form style={comStyles().form}>
	        <Form.Field>
	          <label>Name</label>
	          <Input
	            value={this.state.application_template.name}
	            onChange={(e) => this.updateApplicationAttr(e, 'name')}
	          />
	        </Form.Field>
					<Form.Field>
	          <Radio
	            label='Male'
	            name='gender'
	            value='Male'
	            checked={this.state.application_template.gender === 'Male'}
	            onChange={(e, d) => this.updateApplicationAttr({ target: { value: 'Male' } }, 'gender')}
	          />
						&nbsp; &nbsp;
	          <Radio
	            label='Female'
	            name='gender'
	            value='Female'
	            checked={this.state.application_template.gender === 'Female'}
	            onChange={(e, d) => this.updateApplicationAttr({ target: { value: 'Female' } }, 'gender')}
	          />
	        </Form.Field>
	        <Form.Field>
	          <label>School, Program and Term</label>
	          <Input
	            value={this.state.application_template.school_and_term}
	            onChange={(e) => this.updateApplicationAttr(e, 'school_and_term')}
	          />
	        </Form.Field>
	        <Form.Field>
	          <label>Email</label>
	          <Input
	            value={this.state.application_template.email}
	            onChange={(e) => this.updateApplicationAttr(e, 'email')}
	          />
	        </Form.Field>
	        <Form.Field>
	          <label>Phone</label>
	          <Input
	            value={this.state.application_template.phone}
	            onChange={(e) => this.updateApplicationAttr(e, 'phone')}
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
							fluid
							color='blue'
							content='Add To Group'
							onClick={() => this.addToGroup()}
						/>
	        </Form.Field>
	      </Form>
				<div style={comStyles().summary}>
					<Card raised fluid>
						<Card.Header style={comStyles().card_header}>
							Group Members
						</Card.Header>
						<div style={comStyles().member_list}>
							{
								this.state.group_members.map((member) => {
									return (
										<div style={comStyles().row_member}>
											<div style={comStyles().row_member_name}>{ member.name }</div>
											<div style={comStyles().row_member_email}>{ member.email }</div>
											<div style={comStyles().row_member_button}>
												<Icon name='cancel' onClick={() => this.removeFromGroup(member.id)} />
											</div>
										</div>
									)
								})
							}
						</div>
					</Card>
					<Card raised fluid>
						<Card.Header style={comStyles().card_header}>
							Group Notes for Landlord
						</Card.Header>
						<TextArea
							rows={4}
	            value={this.state.group_notes}
							placeholder='Eg. My group may change, only female roommates please..etc'
	            onChange={(e) => this.setState({ group_notes: e.target.value })}
							style={comStyles().textArea}
	          />
					</Card>
					<Form.Field>
						{
							this.state.group_error_messages.map((err, index) => {
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
					{
						this.state.submitted
						?
						<div style={comStyles().hidden_loading}>
							<img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
						</div>
						:
						<Button
							basic
							fluid
							color='blue'
							onClick={() => this.submitApplication()}
							content='Submit Application'
						/>
					}
				</div>
			</div>
		)
	}
}

// defines the types of variables in this.props
SimpleTermForm.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
  building: PropTypes.object.isRequired,    // passed in
  suites: PropTypes.array.isRequired,       // passed in
	closeModal: PropTypes.func.isRequired,		// passed in
}

// for all optional props, define a default value
SimpleTermForm.defaultProps = {
  tenant_profile: {},
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(SimpleTermForm)

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
      flexDirection: 'row',
		},
		form: {
      display: 'flex',
      flexDirection: 'column',
			width: '50%',
		},
		summary: {
      display: 'flex',
      flexDirection: 'column',
			width: '50%',
			padding: '15px',
		},
		row_member: {
			padding: '10px',
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			borderRadius: '5px',
			backgroundColor: 'rgba(0,0,0,0.1)',
		},
		row_member_name: {
			width: '40%',
			padding: '0px 0px 0px 20px',
		},
		row_member_email: {
			width: '50%',
		},
		row_member_button: {
			width: '10%',
			cursor: 'pointer',
		},
		card_header: {
			padding: '10px',
			fontSize: '1.3rem',
			fontWeight: 'bold',
		},
		member_list: {
			minHeight: '100px',
		},
		textArea: {
			border: '0px solid black',
			padding: '10px',
		},
		hidden_loading: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '20px',
		},
	}
}

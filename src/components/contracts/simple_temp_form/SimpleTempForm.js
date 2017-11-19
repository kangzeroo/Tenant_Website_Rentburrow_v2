// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import uuid from 'uuid'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
	Button,
	Message,
	Radio,
	Card,
	TextArea,
  Dropdown,
  Header,
	Icon,
} from 'semantic-ui-react'
import { validateEmail } from '../../../api/general/general_api'
import { saveSimpleForm } from '../../../api/leasing/leasing_api'
import { insertInquiry } from '../../../api/inquiries/inquiry_api'
import { getTenantByEmail } from '../../../api/auth/tenant_api'

class SimpleTermForm extends Component {

	constructor() {
    super()
    this.state = {
      application_template: {
        first_name: '',
        last_name: '',
        tenant_id: '',
				gender: '',
        school: '',
        program_and_term: '',
        email: '',
        phone: '',
      },
      my_group_may_change: false,
			group_notes: '',
      group_members: [],
			error_messages: [],
			group_error_messages: [],
			submitted: false,
      success_message: '',
      school_options: [
        { key: 'uw', text: 'University of Waterloo', value: 'University of Waterloo' },
        { key: 'wlu', text: 'Wilfrid Laurier University', value: 'Wilfrid Laurier University' }
      ],
      completed_at: ''
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

  updateApplicationType(e, data, attr) {
    this.setState({
      application_template: {
        ...this.state.application_template,
        [attr]: data.value,
      }
    })
  }

	addToGroup() {
		if (this.validateForm()) {
      getTenantByEmail(this.state.application_template.email)
      .then((data) => {
        console.log(data)
        this.setState({
  				group_members: this.state.group_members.concat([{
  					...this.state.application_template,
            tenant_id: data.tenant_id ? data.tenant_id : '',
  					id: uuid.v4(),
  				}]),
  				application_template: {
  					first_name: '',
            last_name: '',
            tenant_id: '',
  					gender: '',
            school: '',
  	        program_and_term: '',
  	        email: '',
  	        phone: '',
  				},
  				error_messages: [],
  			})
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
		if (this.validateGroupForm()) {
			this.setState({
				submitted: true,
				group_error_messages: [],
        error_messages: [],
			})
      insertInquiry({
        group_members: this.state.group_members,
        building_id: this.props.building.building_id,
        group_notes: this.state.group_notes,
      })
      .then((data) => {
        return saveSimpleForm(this.state.group_members.map((member) => {
          return {
          name: [member.first_name, member.last_name].join(' '),
          gender: member.gender,
          school_and_term: [member.school, member.program_and_term].join(', '),
          email: member.email,
          phone: member.phone,
          id: member.id
        }
        }), this.props.building, this.props.landlord, this.state.group_notes)
      })
      .then((data) => {
        this.setState({
          success_message: true,
          completed_at: moment().format('MMM Do YY')
        })
        localStorage.setItem('saved_application', JSON.stringify({
          landlord_id: this.props.landlord.corporation_id,
          landlord_name: this.props.landlord.corporation_name,
          applied_at: new Date().getTime(),
        }))
      })
		}
	}

  validateGroupForm() {
    let ok_to_proceed = true
		const group_error_messages = []
		if (this.state.group_members.length === 0) {
			group_error_messages.push('You must have at least 1 group member')
			ok_to_proceed = false
		}
    if (this.state.group_notes.length === 0) {
      group_error_messages.push('You must tell the landlord which suites you want in the group notes')
			ok_to_proceed = false
    }
		this.setState({
			group_error_messages: group_error_messages,
			submitted: false,
		})
		return ok_to_proceed
  }

	validateForm() {
		let ok_to_proceed = true
		const error_messages = []
		if (this.state.application_template.first_name.length === 0 || this.state.application_template.last_name.length === 0 || this.state.application_template.gender.length === 0) {
			error_messages.push('You must enter a name and gender')
			ok_to_proceed = false
		}
		if (this.state.application_template.program_and_term.length === 0 || this.state.application_template.school.length === 0) {
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
				<div style={comStyles().title}>
					{ this.props.title && this.props.title.toLowerCase().indexOf('waitlist') > -1 ? 'Join Waitlist' : 'Apply Online' }
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
		          <Radio
		            label='Male'
		            name='gender'
		            value='Male'
		            checked={this.state.application_template.gender === 'Male'}
		            onChange={(e, d) => this.updateApplicationAttr({ target: { value: 'Male' } }, 'gender')}
                disabled={this.state.submitted}
		          />
							&nbsp; &nbsp;
		          <Radio
		            label='Female'
		            name='gender'
		            value='Female'
		            checked={this.state.application_template.gender === 'Female'}
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
                  value={this.state.application_template.school}
                  selection
                  options={this.state.school_options}
                  onChange={(e, d) => { this.updateApplicationType(e, d, 'school') }}
                  disabled={this.state.submitted}
                />
              </Form.Field>
  		        <Form.Field>
  		          <label>Program, and Term</label>
  		          <Input
  		            value={this.state.application_template.program_and_term}
  		            onChange={(e) => this.updateApplicationAttr(e, 'program_and_term')}
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
								content={this.state.group_members.length > 0 ? 'Add To Group' : 'Save'}
								onClick={() => this.addToGroup()}
                disabled={this.state.submitted}
							/>
		        </Form.Field>
		      </Form>
          {
            this.state.group_members.length > 0
            ?
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
                            {
                              this.state.submitted
                              ?
                              null
                              :
                              <Icon name='cancel' onClick={() => this.removeFromGroup(member.id)} />
                            }
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
  								placeholder='Eg. Give as much info as possible. Which suites we you ok with? Will your group change? Do you want the landlord to match you with only female roommates? ...etc'
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
                  {
                    this.state.success_message
                    ?
                    null
                    :
                    <img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
                  }
  							</div>
  							:
  							<Button
  								basic
  								fluid
                  icon='lightning'
  								color='blue'
  								onClick={() => this.submitApplication()}
  								content='Submit Application'
  							/>
  						}
  					</div>
            :
            null
          }
				</div>
        {
          this.state.submitted && this.state.success_message
          ?
          <div>
            <Message positive>
              <Header
                as='h3'
                icon='checkmark box'
                content={`Success! The landlord has received your application, you'll hear back from them soon!`}
                subheader={`Submitted on ${this.state.completed_at} EDT, expect to hear from us soon!`}
              />
            </Message>
            <Button
              primary
              icon='chevron left'
              content='Back'
              onClick={() => this.props.closeModal()}
            />
          </div>
          :
          null
        }
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
	title: PropTypes.string.isRequired,				// passed in
  landlord: PropTypes.object.isRequired,    // passed in
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
      flexDirection: 'column',
		},
		title: {
      display: 'flex',
      flexDirection: 'column',
			fontSize: '2rem',
			fontWeight: 'bold',
			padding: '20px 20px 50px 20px',
			width: '100%',
			justifyContent: 'center',
			alignItems: 'center',
		},
		body: {
      display: 'flex',
      flexDirection: 'row',
		},
		form: {
      display: 'flex',
      flexDirection: 'column',
			flexGrow: 1,
		},
		summary: {
      display: 'flex',
      flexDirection: 'column',
			flexGrow: 1,
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
    success: {
      width: '100%',
      padding: '20px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
			fontSize: '1rem',
			fontWeight: 'bold',
    }
	}
}

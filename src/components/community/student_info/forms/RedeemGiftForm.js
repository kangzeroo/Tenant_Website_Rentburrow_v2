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
import { validateEmail } from '../../../../api/general/general_api'
import { redeemGiftEmail } from '../../../../api/messaging/redeem_gift_email'


class RedeemGiftForm extends Component {

	constructor() {
    super()
    this.state = {
      application_template: {
        name: '',
        phone: '',
        email: '',
        notes: '',
      },
			error_messages: [],
			submitted: false,
      success_message: '',
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

	submitApplication() {
		if (this.validateForm()) {
			this.setState({
				submitted: true,
        error_messages: [],
			})
      redeemGiftEmail(this.state.application_template).then((data) => {
        this.setState({
  				success_message: 'Done! Successfully sent message!'
  			})
      })
		}
	}

	validateForm() {
		let ok_to_proceed = true
		const error_messages = []
		if (this.state.application_template.name.length === 0) {
			error_messages.push('You must enter a name and gender')
			ok_to_proceed = false
		}
		if (this.state.application_template.email.length === 0 || !validateEmail(this.state.application_template.email)) {
			error_messages.push('The email entered is not valid')
			ok_to_proceed = false
		}
		if (this.state.application_template.notes.length === 0) {
			error_messages.push('You must enter a message')
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
			<div id='RedeemGiftForm' style={comStyles().container}>
				<div style={comStyles().title}>
					Redeem Your Gift
				</div>
				<Form style={comStyles().form}>
	        <Form.Field>
	          <label>Name</label>
	          <Input
	            value={this.state.application_template.name}
	            onChange={(e) => this.updateApplicationAttr(e, 'name')}
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
            <label>Notes & Group Members</label>
            <TextArea
              rows={4}
              value={this.state.application_template.notes}
              placeholder='Eg. Who is in your group? Any other details we should know?'
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
          <Form.Field>
            {
              this.state.submitted
              ?
              <div style={comStyles().saving} >
                {
                  this.state.success_message
                  ?
                  <div style={comStyles().hidden_loading}>
                    { this.state.success_message }
                  </div>
                  :
                  <div style={comStyles().hidden_loading}>
                    <img src='https://s3.amazonaws.com/rentburrow-static-assets/Loading+Icons/loading-blue-clock.gif' width='50px' height='auto' />
                  </div>
                }
              </div>
              :
              <Button
                fluid
                color='blue'
                content='Submit'
                onClick={() => this.submitApplication()}
              />
            }
          </Form.Field>
	      </Form>
			</div>
		)
	}
}

// defines the types of variables in this.props
RedeemGiftForm.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
RedeemGiftForm.defaultProps = {
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(RedeemGiftForm)

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
    },
		textArea: {
			border: '1px solid gray',
			padding: '10px',
		},
	}
}

// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Header,
  Form,
  TextArea,
  Button,
  Message,
} from 'semantic-ui-react'
import { submitRequest, } from '../../api/requests/request_api'

class PropertyRequest extends Component {

  constructor() {
    super()
    this.state = {
      full_name: '',
      email: '',
      phone: '',
      description: '',

      completed_at: '',
      complete: false,

      errors: [],
    }
  }

  submitRequest() {
    if (this.formValidation()) {
      submitRequest({
        first_name: this.state.full_name.split(/[, ]+/).slice(0, -1).join(' '),
        last_name: this.state.full_name.split(/[, ]+/).pop(),
        email: this.state.email,
        phone: this.state.phone,
        description: this.state.description,
      })
      .then((data) => {
        this.setState({
          completed_at: data.created_at,
          complete: true,
        })
      })
    }
  }

  formValidation() {
    let submittable = true
    const errors = []
    if (this.state.full_name.length === 0 || this.state.email.length === 0) {
      errors.push('You must include your name and email')
    }

    if (this.state.description.length === 0) {
      errors.push('You must include a request')
    }

    if (errors.length > 0) {
      submittable = false
    }

    this.setState({
      errors: errors,
    })

    return submittable
  }

  updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value,
			current_active_field: attr,
		})
	}

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().headerContainer} >
  				<Header
            as='h1'
            icon='pin'
            content="Can't Find What You're Looking For?"
            subheader="We will find your perfect property for you, just tell us what you're looking for!"
          />
        </div>
        <Form style={comStyles().formContainer} >
          <Form.Field required>
            <label>Full Name</label>
            <input
              placeholder='John Smith'
              onChange={(e) => this.updateAttr(e, 'full_name')}
              value={this.state.full_name}
            />
          </Form.Field>
          <Form.Group unstackable widths={2}>
            <Form.Field required>
              <label>Email Address</label>
              <input
                placeholder='john.smith@gmail.com'
                onChange={(e) => this.updateAttr(e, 'email')}
                value={this.state.email}
              />
            </Form.Field>
            <Form.Field required>
              <label>Phone Number</label>
              <input
                placeholder='6471234567'
                onChange={(e) => this.updateAttr(e, 'phone')}
                value={this.state.phone}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <label>Description</label>
            <TextArea
              placeholder='Im looking for a 4 Bedroom suite, ranging from $400 - $600 per month, at least a 10 minute bus ride to the University of Waterloo'
              onChange={(e) => this.updateAttr(e, 'description')}
              value={this.state.description}
            />
          </Form.Field>
          <Form.Field>
            {
              this.state.errors.map((err, index) => {
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
            this.state.complete
            ?
            <Message positive>
              <Header
                as='h3'
                icon='checkmark box'
                content='Request Received by Rentburrow'
                subheader={`Submitted on ${this.state.completed_at} EDT, expect to hear from us soon!`}
              />
            </Message>
            :
            <Form.Field style={comStyles().buttonsContainer}>
              <div />
              <Button
                primary
                content='Submit'
                onClick={() => this.submitRequest()}
              />
            </Form.Field>
          }
        </Form>
      </div>
		)
	}
}

// defines the types of variables in this.props
PropertyRequest.propTypes = {
	history: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PropertyRequest.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PropertyRequest)

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
      height: '100%',
      width: '100%',
		},
    headerContainer: {
      margin: '10px 10px 10px 0px'
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
	}
}

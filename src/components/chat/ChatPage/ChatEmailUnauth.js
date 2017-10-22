// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Modal,
  Input,
  Button,
  Message,
} from 'semantic-ui-react'
import LoginPopup from '../../auth/LoginPopup'
import { validateEmail } from '../../../api/general/general_api'


class ChatEmailUnauth extends Component {

  constructor() {
    super()
    this.state = {
      email: '',
      name: '',
      error_messages: [],
    }
  }

  rememberEmail(email, name) {
    const errors = []
    if (!validateEmail(email)) {
      errors.push('Not a valid email')
    }
    if (name.length === 0) {
      errors.push('Missing your name')
    }
    if (errors.length === 0) {
      this.toggleModal(false)
      this.props.closePrompt()
      localStorage.setItem('unauthUser_email', email)
      localStorage.setItem('unauthUser_name', name)
    }
    this.setState({
      error_messages: errors,
    })
  }

  // toggle modal
  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'login') {
      return (
        <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
          <LoginPopup
            toggleModal={(a, b, c) => this.toggleModal(a, b, c)}
          />
        </Modal>
      )
    }
    return null
  }

	render() {
		return (
			<div style={comStyles().container}>
        <div style={comStyles().signin_message}>
          Without signing in, your messages will not be saved if you clear your history.
          &nbsp;
          <span onClick={() => this.toggleModal(true, 'login')} style={comStyles().signin_link}>Sign In.</span>
        </div>

        <div style={comStyles().leave_email}>
          Or leave your email for the landlord <br /><br />
          {
            this.state.error_messages.length > 0
            ?
            this.state.error_messages.map((err) => {
              return (
                <Message
                  visible
                  key='error'
                  error
                  content={err}
                />
              )
            })
            :
            null
          }
          <div style={comStyles().email_form}>
            <Input fluid placeholder='email' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
            <Input fluid placeholder='name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
            <Button fluid color='green' content='Save' onClick={() => this.rememberEmail(this.state.email, this.state.name)} />
          </div>
        </div>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
ChatEmailUnauth.propTypes = {
	history: PropTypes.object.isRequired,
  closePrompt: PropTypes.func.isRequired,
}

// for all optional props, define a default value
ChatEmailUnauth.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(ChatEmailUnauth)

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
      width: '100%',
      height: 'auto',
      padding: '10px',
      backgroundColor: 'azure',
      borderRadius: '10px',
		},
    signin_message: {
      margin: '0px 0px 10px 0px'
    },
    signin_link: {
      cursor: 'pointer',
      color: 'blue',
      textDecoration: 'underline',
    },
    leave_email: {

    },
    email_form: {
      display: 'flex',
      flexDirection: 'column',
      margin: '10x 0px 0px 0px',
    }
	}
}

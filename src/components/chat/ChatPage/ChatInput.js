import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import uuid from 'uuid'
import { Form, TextArea } from 'semantic-ui-react'
import {
  xMidBlue
} from '../../../styles/base_colors'
import { sendChatMessage } from '../../../actions/messaging/messaging_actions'


class ChatInput extends Component {

  constructor() {
    super()
    this.state = {
      inputText: '',

      toggle_modal: false,
      modal_name: '',              // name of the modal
      context: {},
    }
  }

  componentDidMount() {
    // get a hold of our stream sources
    // const sendBtn = document.getElementById('sendBtn')
    const textInput = document.getElementById('textInput')

    // create a stream for each source
    // const sendBtnStream = Rx.Observable.fromEvent(sendBtn, 'click').map(e => true)
    const enterKeyPressedStream = Rx.Observable.fromEvent(textInput, 'keyup').filter(e => e.keyCode === 13)
    const textEnteredStream = Rx.Observable.fromEvent(textInput, 'keyup').map(e => e.target.value)

    // merge the sendBtnStream and the enterKeyPressedStream
    // const sendMessageStream = Rx.Observable.merge(sendBtnStream, enterKeyPressedStream)
    // our merged stream will allow for textEnteredStream until sendMessageStream occurs
    const mergedStream = textEnteredStream.takeUntil(enterKeyPressedStream)

    const onNext = (text) => {
      this.setState({ inputText: text, checked: true })
    }
    const onError = (err) => {
      console.log(err)
    }
    const onComplete = () => {
      let additionalInfo = {}
      if (!this.props.authenticated && localStorage.getItem('unauthUser_email')) {
        additionalInfo = {
          unauth_email: localStorage.getItem('unauthUser_email')
        }
      }
      // a channel_id is comprised of corporation_id + corporation_id + building_id
      const newMessage = {
        message_id: uuid.v4(),
        sender_id: this.props.tenant_profile.tenant_id,
        receiver_id: this.props.chat_help ? 'Rentburrow_Student_Help_Chat' : this.props.corporation.corporation_id,
        tenant_id: this.props.tenant_profile.tenant_id,
        tenant_name: `${this.props.tenant_profile.first_name} ${this.props.tenant_profile.last_name}`,
        building_id: this.props.chat_help ? 'main_page_chat_help' : this.props.selected_building.building_id,
        // building_thumbnail: this.props.building_target.thumbnail,
        building_alias: this.props.chat_help ? 'Main Page Help' : this.props.selected_building.building_address,
        corporation_id: this.props.chat_help ? 'Rentburrow_Student_Help_Chat' : this.props.corporation.corporation_id,
        corporation_name: this.props.chat_help ? 'Rentburrow Help' : this.props.corporation.corporation_name,
        channel_id: this.props.chat_help ? `Rentburrow_Student_Help_Chat_${this.props.tenant_profile.tenant_id}` : `${this.props.corporation.corporation_id}_${this.props.tenant_profile.tenant_id}`,
        contents: this.state.inputText,
        sent_at: new Date().getTime(),
        ...additionalInfo,
      }
      this.setState({
        inputText: '',
        checked: false
      })
      this.props.sendChatMessage(newMessage)
      mergedStream.subscribe({
        next: onNext,
        error: onError,
        complete: onComplete
      })
    }

    mergedStream.subscribe({
      next: onNext,
      error: onError,
      complete: onComplete
    })
  }

  handleTyping(event) {
    this.setState({
      inputText: event.target.value
    })
  }

	render() {
    return (
      <Form>
        <TextArea
          id='textInput'
          autoHeight
          value={this.state.inputText}
          onChange={(e) => this.handleTyping(e)}
          placeholder='Send a message'
          disabled={!this.props.authenticated && !localStorage.getItem('unauthUser_email') ? true : false}
          style={comStyles().textbox}
        />
      </Form>
    )
	}
}

ChatInput.propTypes = {
  sendChatMessage: PropTypes.func.isRequired,
  corporation: PropTypes.object.isRequired,     // passed in
  tenant_profile: PropTypes.object.isRequired,
  selected_building: PropTypes.object,          // passed in
  chat_help: PropTypes.bool,
  authenticated: PropTypes.bool,
  showing_email_unauth: PropTypes.bool,         // passed in
}

ChatInput.defaultProps = {
  selected_building: {},
  chat_help: false,
  authenticated: false,
  showing_email_unauth: true,
}

const RadiumHOC = Radium(ChatInput)

function mapStateToProps(state) {
	return {
    tenant_profile: state.auth.tenant_profile,
    chat_help: state.messaging.chat_help,
    authenticated: state.auth.authenticated,
	}
}

export default connect(mapStateToProps, {
  sendChatMessage,
})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		mainview: {

		}
	}
}

const inputStyles = () => {
  return {
    input: {
      // height: 'auto',
      flex: 1,
      minWidth: '380px',
      maxWidth: '380px',
      borderTop: `3px solid ${xMidBlue}`,
      position: 'absolute',
      bottom: '0px',
      minHeight: '15%',
      maxHeight: '15%',
    },
    inputDiv: {
      position: 'relative',
      height: '100%',
    },
    textInput: {
      minHeight: '50px',
      fontFamily: 'sans-serif',
      fontSize: '14px',
      boxSizing: 'border-box',
      padding: '4px',
      border: '1px solid',
      overflow: 'hidden',
      width: '85%',
      height: '100%',
      position: 'absolute',
      resize: 'none',
      whiteSpace: 'normal',
      padding: '10px 20px 10px 20px',
    },
    textHeight: {
      minHeight: '50px',
      fontFamily: 'sans-serif',
      fontSize: '14px',
      boxSizing: 'border-box',
      padding: '4px',
      border: '1px solid',
      overflow: 'hidden',
      width: '85%',
      visibility: 'hidden',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      padding: '10px 20px 10px 20px',
    },
    sendBtn: {
      position: 'absolute',
      height: '20px',
      right: '8px',
      bottom: '8px',
      margin: '5px auto',
      border: '2px gray',
      borderRadius: '5px',
      fontSize: '1rem',
      color: 'gray',
      padding: '5px',
      cursor: 'pointer'
    },
    textbox: {
      maxHeight: '200px',
    }
  }
}

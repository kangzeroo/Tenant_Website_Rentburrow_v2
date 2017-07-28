import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
  xMidBlue
} from '../../../../styles/base_colors'
import { sendChatMessage, backToChatChannels } from '../../../../actions/messaging/messaging_actions'
import ChatFeed from './ChatFeed'
import ChatInput from './ChatInput'

class Chatbox extends Component {

	render() {
		return (
			<div id='chatbox' style={comStyles().container}>
        <div style={headerStyles().header}>
          <i className='ion-chevron-left' onClick={() => this.props.backToChatChannels()} style={headerStyles().icon} />
          <p style={headerStyles().recipient_name}>{this.props.corporation_target.corporation_name}</p>
          <i className='ion-close-round' onClick={() => this.props.hideChat()} style={headerStyles().icon} />
        </div>
        <ChatFeed
          all_messages={this.props.all_messages}
          corporation={this.props.corporation}
        />
        <ChatInput
          corporation={this.props.corporation}
          corporation_target={this.props.corporation_target}
          building_target={this.props.building_target}
          sendChatMessage={this.props.sendChatMessage}
        />
			</div>
		)
	}
}

Chatbox.propTypes = {
  corporation: PropTypes.object,
  all_messages: PropTypes.array.isRequired,
  building_target: PropTypes.object.isRequired,
  corporation_target: PropTypes.object.isRequired,
  sendChatMessage: PropTypes.func.isRequired,
  hideChat: PropTypes.func.isRequired,
}

Chatbox.defaultProps = {
  corporation: null,
}

const RadiumHOC = Radium(Chatbox)

function mapStateToProps(state) {
	return {
    corporation: state.auth.corporation_profile,
    all_messages: state.messaging.all_messages,
    building_target: state.messaging.building_target,
    corporation_target: state.messaging.corporation_target,
	}
}

export default connect(mapStateToProps, {
  sendChatMessage,
  backToChatChannels,
})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {
      minWidth: '100%',
      minHeight: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
		},
	}
}

const headerStyles = () => {
  return {
    header: {
      // height: '50px',
      backgroundColor: xMidBlue,
      textAlign: 'center',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    recipient_name: {
      color: 'white',
      fontSize: '1.3rem',
      fontWeight: 'bold',
      fontFamily: `'Montserrat', 'sans-serif'`,
      margin: '10px',
      flex: 4
    },
    icon: {
      flex: 1,
      fontSize: '2em',
      cursor: 'pointer',
    }
  }
}

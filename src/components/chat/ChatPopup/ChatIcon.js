import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
  Label
} from 'semantic-ui-react'
import {
  xMidBlue
} from '../../../styles/base_colors'
import { initializeFirebase } from '../../../actions/messaging/messaging_actions'


class ChatIcon extends Component {

  iconClicked() {
    if (!this.props.notifications_permission_asked) {
      this.props.initializeFirebase()
    }
    this.props.toggleChatVisible()
  }

  anyNewMessages(messages) {
    const new_channels = []
    messages.forEach((msg) => {
      let exists = false
      if (msg.sender_id === this.props.tenant_profile.tenant_id) {
        exists = true
      }
      new_channels.forEach((ch_msg) => {
        if (ch_msg.channel_id === msg.channel_id) {
          exists = true
        }
      })
      if (!exists) {
        new_channels.push(msg)
      }
    })
    return new_channels.length
  }

	render() {
		return (
			<div onClick={()=> this.iconClicked()} style={comStyles().container}>
        {
          this.props.chat_open
          ?
          <img src='https://s3.amazonaws.com/rentburrow3-images/close_icon.png' style={comStyles().cancel} />
          :
          <div>
            {
              this.anyNewMessages(this.props.all_messages) > 0
              ?
              <div>
                <img src='https://s3.amazonaws.com/rentburrow3-images/chat_icon.png' style={comStyles().happychat} />
                <Label color='red' circular floating>{this.anyNewMessages(this.props.all_messages)}</Label>
              </div>
              :
              <img src='https://s3.amazonaws.com/rentburrow3-images/chat_icon.png' style={comStyles().happychat} />
            }
          </div>
        }
			</div>
		)
	}
}

ChatIcon.propTypes = {
  chat_open: PropTypes.bool,
  toggleChatVisible: PropTypes.func.isRequired,        // passed in
  initializeFirebase: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,        // passed
  all_messages: PropTypes.array.isRequired,
}

ChatIcon.defaultProps = {
  chat_open: false
}

const RadiumHOC = Radium(ChatIcon)

function mapStateToProps(state) {
	return {
    notifications_permission_asked: state.messaging.notifications_permission_asked,
    tenant_profile: state.auth.tenant_profile,
    all_messages: state.messaging.all_messages,
	}
}

export default connect(mapStateToProps, {
  initializeFirebase,
})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {
      minHeight: '70px',
      minWidth: '70px',
      maxHeight: '70px',
      maxWidth: '70px',
      borderRadius: '50%',
      backgroundColor: xMidBlue,
      cursor: 'pointer',
      overflow: 'hidden'
		},
    happychat: {
      height: '50px',
      width: 'auto',
      margin: '10px 20px 10px 10px'
    },
    cancel: {
      height: '50px',
      width: 'auto',
      margin: '10px 20px 10px 10px'
    }
	}
}

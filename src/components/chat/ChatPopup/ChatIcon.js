import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
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

	render() {
		return (
			<div onClick={()=> this.iconClicked()} style={comStyles().container}>
        {
          this.props.chat_open
          ?
          <img src='https://s3.amazonaws.com/rentburrow3-images/close_icon.png' style={comStyles().cancel} />
          :
          <img src='https://s3.amazonaws.com/rentburrow3-images/chat_icon.png' style={comStyles().happychat} />
        }
			</div>
		)
	}
}

ChatIcon.propTypes = {
  chat_open: PropTypes.bool,
  toggleChatVisible: PropTypes.func.isRequired,        // passed in
  initializeFirebase: PropTypes.func.isRequired,
}

ChatIcon.defaultProps = {
  chat_open: false
}

const RadiumHOC = Radium(ChatIcon)

function mapStateToProps(state) {
	return {
    notifications_permission_asked: state.messaging.notifications_permission_asked,
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

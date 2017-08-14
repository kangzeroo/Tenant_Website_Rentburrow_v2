import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import {
  xMidBlue
} from '../../../styles/base_colors'
import ChatsDash from '../ChatPage/ChatsDash'
import ChatsPanel from '../ChatPage/ChatsPanel'


class ChatContainer extends Component {

	renderAppropriateView() {
		let view = null
		if (this.props.current_thread.length === 0) {
      view = (
        <ChatsPanel
          messages={this.props.all_messages}
          thread={this.props.current_thread}
        />
      )
		} else {
			view = (
				<ChatsDash
          messages={this.props.all_messages}
          thread={this.props.current_thread}
        />
			)
		}
		return view
	}

	render() {
		return (
			<div style={comStyles().container}>
				{
					this.renderAppropriateView()
				}
			</div>
		)
	}
}

ChatContainer.propTypes = {
	hideChat: PropTypes.func.isRequired,				// passed in
	chat_open: PropTypes.bool,			// passed in
  all_messages: PropTypes.array,
  current_thread: PropTypes.array,
}

ChatContainer.defaultProps = {
	chat_open: false,
  all_messages: [],
  current_thread: [],
}

const RadiumHOC = Radium(ChatContainer)

function mapStateToProps(state) {
	return {
		all_messages: state.messaging.all_messages,
    current_thread: state.messaging.current_thread,
	}
}

export default connect(mapStateToProps, {})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'flex-end',
			position: 'absolute',
			bottom: '80px',
			height: '600px',
			width: '380px',
      border: `4px solid ${xMidBlue}`,
      borderRadius: '25px',
			overflow: 'hidden',
      zIndex: 9
		},
		chatbox: {
      backgroundColor: 'white'
		},
		icon: {
		}
	}
}

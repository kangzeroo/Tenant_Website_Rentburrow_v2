import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import ChatsPanel from './ChatsPanel'
import ChatsDash from './ChatsDash'


class ChatPage extends Component {

	constructor() {
		super()
		this.state = {
			currentThread: []
		}
	}

	selectThread(thread) {
		this.setState({
			currentThread: thread,
		})
	}

	render() {
		return (
			<div className='pretty_scrollbar' style={comStyles().container}>
				<ChatsPanel messages={this.props.messages} selectThread={(thread) => this.selectThread(thread)} style={comStyles().chatspanel} />
				<ChatsDash onPage={true} thread={this.state.currentThread} style={comStyles().chatsdash} />
			</div>
		)
	}
}

ChatPage.propTypes = {
	messages: PropTypes.array,
}

ChatPage.defaultProps = {
	messages: []
}

const RadiumHOC = Radium(ChatPage)

function mapStateToProps(state) {
	return {
		messages: state.messaging.all_messages,
	}
}

export default connect(mapStateToProps, {})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'row',
			height: '93vh',
			overflow: 'hidden'
		},
		chatspanel: {
		},
		chatsdash: {
		}
	}
}

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
			<div style={comStyles().container}>
				<ChatsPanel messages={this.props.messages} selectThread={(thread) => this.selectThread(thread)} style={comStyles().chatspanel} />
				<ChatsDash thread={this.state.currentThread} />
			</div>
		)
	}
}

ChatPage.propTypes = {
	messages: PropTypes.array.isRequired,
}

ChatPage.defaultProps = {

}

const RadiumHOC = Radium(ChatPage)

function mapStateToProps(state) {
	return {
		messages: mockMessages(),
	}
}

export default connect(mapStateToProps, {})(RadiumHOC)

// ===============================

const comStyles = () => {
	return {
		container: {
			display: 'flex',
			flexDirection: 'row',
		},
	}
}

const mockMessages = () => {
	return [
		{
			message_id: '93u8j-jsf9-osjdf',
			channel_id: '9348j-adf-394oj_9345h-asdfj-34ouhd',
			tenant_id: '9348j-adf-394oj',
			corporation_id: '9345h-asdfj-34ouhd',
			building_id: '38909-sfasg-93o4hj',
			building_address: '358 Columbia St',
			tenant_name: 'John Banks',
			corporation_name: 'RezOne',
			message_contents: 'Any space left at 348 Columbia?',
			sent_at: 9834759085024,
		},
		{
			message_id: '93u8j-js0oj9-osjdf',
			channel_id: '9348j-adf-394oj_9345h-asdfj-34ouhd',
			tenant_id: '9348j-adf-394oj',
			corporation_id: '9345h-asdfj-34ouhd',
			building_id: '38909-sfasg-93o4hj',
			building_address: '358 Columbia St',
			tenant_name: 'John Banks',
			corporation_name: 'RezOne',
			message_contents: 'I have a group of four ready to sign',
			sent_at: 9834759085345,
		},
		{
			message_id: '93u8j-jsfg9-osjdf',
			channel_id: '9348j-adf-394oj_9345h-asdfj-34ouhd',
			tenant_id: '9348j-adf-394oj',
			corporation_id: '9345h-asdfj-34ouhd',
			building_id: '38909-sfasg-93o4hj',
			building_address: '358 Columbia St',
			tenant_name: 'John Banks',
			corporation_name: 'RezOne',
			message_contents: 'Also do you have any promos?',
			sent_at: 9834759085890,
		},
		{
			message_id: '9923i8j-jsf9-osjdf',
			channel_id: 'ljsd-24jf-sdf_9345h-asdfj-34ouhd',
			tenant_id: 'ljsd-24jf-sdf',
			corporation_id: '9345h-asdfj-34ouhd',
			building_id: '38sd9-sfasg-93o4hj',
			building_address: '180 Sunview St',
			tenant_name: 'Ashley Chen',
			corporation_name: 'RezOne',
			message_contents: 'Do you guys allow for pets?',
			sent_at: 9834759086024,
		},
		{
			message_id: '9ajosdfu8j-jsf9-osjdf',
			channel_id: 'ljsd-24jf-sdf_9345h-asdfj-34ouhd',
			tenant_id: 'ljsd-24jf-sdf',
			corporation_id: '9345h-asdfj-34ouhd',
			building_id: '38sd9-sfasg-93o4hj',
			building_address: '180 Sunview St',
			tenant_name: 'Ashley Chen',
			corporation_name: 'RezOne',
			message_contents: 'I have a cat',
			sent_at: 9834759086100,
		},
		{
			message_id: '9o0nj-jsf9-os2jdf',
			channel_id: '09344-24jf-sdf_9345h-asdfj-34ouhd',
			tenant_id: '09344-24jf-sdf',
			corporation_id: '9345h-asdfj-34ouhd',
			building_id: '38910-sfasg-93o4hj',
			building_address: '310 King St',
			tenant_name: 'Demar Lorenzo',
			corporation_name: 'RezOne',
			message_contents: 'Como estas precardo?',
			sent_at: 9834759089001,
		},
	]
}

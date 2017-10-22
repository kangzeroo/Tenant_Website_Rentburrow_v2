// This reducer is all about the in-app live-chat
// The messaging state handles all selections within the chat system
// such as: sending a message, which corporation you are currently talking to...etc

// keep in mind the flow of messages to the staff member
// message goes in order of: from tenant-> to corporation -> to staff chat subscriptions -> to staff message inbox

import {
	ADD_MESSAGE,
	ADD_ALL_MESSAGES,
	SELECT_THREAD,
	REQUEST_NOTIFICATIONS_PERMISSION,
	CHAT_HELP,
	SELECT_BUILDING,
} from '../../actions/action_types'

const INITIAL_STATE = {
	all_messages: [],
	current_thread: [],
	notifications_permission_asked: false,
	chat_help: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REQUEST_NOTIFICATIONS_PERMISSION:
			return {
				...state,
				notifications_permission_asked: true
			}
		case ADD_MESSAGE:
			return {
				...state,
				all_messages: state.all_messages.concat(action.payload)
			}
		case ADD_ALL_MESSAGES:
			return {
				...state,
				all_messages: action.payload,
			}
		case SELECT_THREAD:
			let go_back = {
				go_back: state.chat_help
			}
			if (action.payload.length === 0) {
				go_back.chat_help = false
			}
			return {
				...state,
				current_thread: action.payload.sort((a, b) => {
					return a.sent_at - b.sent_at
				}),
				...go_back,
			}
		case SELECT_BUILDING:
			return {
				...state,
				chat_help: false,
			}
		case CHAT_HELP:
			return {
				...state,
				chat_help: true,
			}
		default:
			return {
				...state
			}
	}
}

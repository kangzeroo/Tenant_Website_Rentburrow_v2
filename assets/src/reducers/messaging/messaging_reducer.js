// This reducer is all about the in-app live-chat
// The messaging state handles all selections within the chat system
// such as: sending a message, which corporation you are currently talking to...etc

// keep in mind the flow of messages to the staff member
// message goes in order of: from tenant-> to corporation -> to staff chat subscriptions -> to staff message inbox

import {
	ADD_MESSAGE,
	SELECT_CHAT_BUILDING,
	SELECT_CHAT_CORPORATION,
	SELECT_CHAT_CHANNEL,
	BACK_TO_CHAT_CHANNELS,
} from '../../actions/action_types'

const INITIAL_STATE = {
	all_messages: [],
	building_target: {
    // building_id: 25245921949,
		// building_type: 'highrise',
		// formatted_address: '1 Columbia',
  },
	corporation_target: {
    // corporation_id: '33cc0669-f407-4470-bb26-5e43742e3758',
		// corporation_name: 'Sage Living',
  },
	channel_target: {
		// channel_id: ''
	}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_MESSAGE:
			return {
				...state,
				all_messages: state.all_messages.concat(action.payload)
			}
		case SELECT_CHAT_BUILDING:
			return {
				...state,
				building_target: action.payload
			}
		case SELECT_CHAT_CORPORATION:
			return {
				...state,
				corporation_target: action.payload
			}
		case SELECT_CHAT_CHANNEL:
			return {
				...state,
				channel_target: action.payload
			}
		case BACK_TO_CHAT_CHANNELS:
			return {
				...state,
				building_target: {},
				corporation_target: {},
				channel_target: {},
			}
		default:
			return {
				...state
			}
	}
}

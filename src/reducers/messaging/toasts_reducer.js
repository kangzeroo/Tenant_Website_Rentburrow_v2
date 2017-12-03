// This reducer is all about the in-app live-chat
// The messaging state handles all selections within the chat system
// such as: sending a message, which corporation you are currently talking to...etc

// keep in mind the flow of messages to the staff member
// message goes in order of: from tenant-> to corporation -> to staff chat subscriptions -> to staff message inbox

import {
  ADD_TOAST,
	REMOVE_TOAST,
} from '../../actions/action_types'

const INITIAL_STATE = {
	toasts: [],
}

// const example_toast = {
//   id: 'alsdfjasf',
//   title: 'Alert!',
//   text: 'This is a toast message',
//   color: 'blue',
//   link: 'https://localhost:8081/contact',
//   icon: 'phone'
// }

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_TOAST:
			return {
				...state,
				toasts: state.toasts.concat([action.payload])
			}
    case REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => {
          return t.id !== action.payload
        })
      }
		default:
			return {
				...state
			}
	}
}

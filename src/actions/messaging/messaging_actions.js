import {
	SEND_MESSAGE,
	ADD_MESSAGE,
	SELECT_THREAD,
	REQUEST_NOTIFICATIONS_PERMISSION,
} from '../action_types'

// send a message via FCM
export const sendChatMessage = (msg) => {
	return (dispatch) => {
		dispatch({
			type: SEND_MESSAGE,
			payload: [msg]
		})
	}
}

// save a message to redux
export const addChatHistory = (msgs) => {
	return {
		type: ADD_MESSAGE,
		payload: msgs
	}
}

// select the chat channel that we are on
export const selectChatThread = (thread) => {
	console.log(thread)
	console.log('selectChatThread()')
	return (dispatch) => {
		dispatch({
			type: SELECT_THREAD,
			payload: thread
		})
	}
}

export const initializeFirebase = () => {
	return (dispatch) => {
		dispatch({
			type: REQUEST_NOTIFICATIONS_PERMISSION
		})
	}
}

export const setFCMToken = (token) => {
	return {
		type: 'SET_FCM_TOKEN',
		payload: token
	}
}

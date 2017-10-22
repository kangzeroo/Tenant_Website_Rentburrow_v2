import {
	SEND_MESSAGE,
	ADD_MESSAGE,
	ADD_ALL_MESSAGES,
	SELECT_THREAD,
	REQUEST_NOTIFICATIONS_PERMISSION,
	CHAT_HELP,
	LISTEN_TO_FIREBASE_DB,
} from '../action_types'

// send a message via FCM
export const sendChatMessage = (msg) => {
	return (dispatch) => {
		// dispatch({
		// 	type: LISTEN_TO_FIREBASE_DB
		// })
		dispatch({
			type: SEND_MESSAGE,
			payload: msg
		})
	}
}

export const initializeFirebaseChatDb = (tenant_id) => {
	return (dispatch) => {
		dispatch({
			type: LISTEN_TO_FIREBASE_DB,
			payload: tenant_id
		})
	}
}

export const selectHelpThread = () => {
	return (dispatch) => {
		dispatch({
			type: CHAT_HELP,
		})
	}
}

// replaces all messages
export const updateChatHistory = (msgs) => {
	return {
		type: ADD_ALL_MESSAGES,
		payload: msgs
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

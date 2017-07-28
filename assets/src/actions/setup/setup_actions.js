import {
	CONNECT_WEBSOCKETS,
	INITIATE_POUCHDB,
} from '../action_types'

// initiate websockets
export const setupWebsockets = (userId) => {
	return (dispatch) => {
		dispatch({
			type: CONNECT_WEBSOCKETS,
			payload: userId
		})
	}
}

// initiate pouchdb
export const initiatePouchDB = (userId) => {
	return {
		type: INITIATE_POUCHDB,
		payload: userId
	}
}

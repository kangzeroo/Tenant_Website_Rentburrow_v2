// everything to do with the staff

import {
	TOGGLE_ACCOUNT_POPUP,
} from '../../actions/action_types'

const INITIAL_STATE = {
	account_popup: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TOGGLE_ACCOUNT_POPUP:
			return {
				...state,
				account_popup: action.payload
			}
		default:
			return {
				...state
			}
	}
}

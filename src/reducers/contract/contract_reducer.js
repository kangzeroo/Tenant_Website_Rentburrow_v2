import {
  I_APPLIED,
  APPLIED_TO_ME,
} from '../../actions/action_types'

const INITIAL_STATE = {
  sent_applications: [],
  received_applications: [],
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case I_APPLIED:
      return {
        ...state,
        sent_applications: action.payload,
      }
    case APPLIED_TO_ME:
      return {
        ...state,
        received_applications: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

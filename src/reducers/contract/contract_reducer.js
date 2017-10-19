import {
  I_APPLIED,
  APPLIED_TO_ME,
  APPLY_FOR_THIS_BUILDING,
} from '../../actions/action_types'

const INITIAL_STATE = {
  sent_applications: [],
  received_applications: [],
  selected_building_to_apply_for: {},
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
    case APPLY_FOR_THIS_BUILDING:
      return {
        ...state,
        selected_building_to_apply_for: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

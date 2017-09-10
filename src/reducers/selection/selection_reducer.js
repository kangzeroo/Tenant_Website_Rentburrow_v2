import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_POPUP_BUILDING,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_building: null,
  selected_landlord: null,
  popup_building: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SELECT_BUILDING:
      return {
        ...state,
        selected_building: action.payload,
      }
    case SELECT_CORPORATION:
      return {
        ...state,
        selected_landlord: action.payload,
      }
    case SELECT_POPUP_BUILDING:
      return {
        ...state,
        popup_building: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

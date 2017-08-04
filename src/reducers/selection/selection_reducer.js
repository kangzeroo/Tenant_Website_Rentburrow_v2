import {
  SELECT_BUILDING,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_building: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SELECT_BUILDING:
      return {
        ...state,
        selected_building: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

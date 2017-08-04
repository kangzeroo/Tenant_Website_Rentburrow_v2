import {
  FOUND_BUILDINGS,
  CHANGE_CARD_STYLE,
  SELECT_PIN,
} from '../../actions/action_types'

const INITIAL_STATE = {
  search_results: [],
  card_style: 'grid',       // row, grid or cover
  selected_pin: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case FOUND_BUILDINGS:
      return {
        ...state,
        search_results: action.payload,
      }
    case CHANGE_CARD_STYLE:
      return {
        ...state,
        card_style: action.payload,
      }
    case SELECT_PIN:
      return {
        ...state,
        selected_pin: action.payload
      }
		default:
			return {
				...state
			}
	}
}

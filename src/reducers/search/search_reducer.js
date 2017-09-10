import {
  SEARCH_STRING,
  FOUND_BUILDINGS,
  CHANGE_CARD_STYLE,
  CHANGE_SEARCH_STYLE,
  SELECT_PIN,
} from '../../actions/action_types'

const INITIAL_STATE = {
  search_string: '',
  search_results: [],
  buildings: [],
  search_style: 'map',     // list, map
  card_style: 'grid',       // row, grid or cover
  selected_pin: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SEARCH_STRING:
      return {
        ...state,
        search_string: action.payload,
        search_results: state.buildings.filter((building) => {
          return building.building_alias.toLowerCase().indexOf(action.payload.toLowerCase()) > -1 || building.building_address.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
        })
      }
    case FOUND_BUILDINGS:
      return {
        ...state,
        search_results: action.payload,
        buildings: action.payload,
      }
    case CHANGE_SEARCH_STYLE:
      return {
        ...state,
        search_style: action.payload,
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

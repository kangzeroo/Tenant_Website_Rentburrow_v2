import {
  SEARCH_STRING,
  FOUND_BUILDINGS,
  FILTERED_BUILDINGS,
  CHANGE_CARD_STYLE,
  CHANGE_SEARCH_STYLE,
  SELECT_PIN,
  FOUND_SUBLETS,
  SELECT_POPUP_BUILDING,
  FILTERED_SUBLETS,
} from '../../actions/action_types'
import { findAllMatchingGPS } from '../../api/map/map_api'

const INITIAL_STATE = {
  search_string: '',
  buildings: [],
  sublets: [],
  building_search_results: [],
  sublet_search_results: [],
  popup_buildings: [],      // for when you click on a pin and get quick info
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
        building_search_results: state.buildings.filter((building) => {
          return building.building_alias.toLowerCase().indexOf(action.payload.toLowerCase()) > -1 || building.building_address.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
        }),
        sublet_search_results: state.sublets.filter((sublet) => {
          return sublet.address.toLowerCase().indexOf(action.payload.toLowerCase()) > -1
        })
      }
    case FOUND_BUILDINGS:
      return {
        ...state,
        building_search_results: action.payload,
        buildings: action.payload,
      }
    case FILTERED_BUILDINGS:
      return {
        ...state,
        building_search_results: action.payload,
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
        selected_pin: action.payload,
      }
    case FOUND_SUBLETS:
      return {
        ...state,
        sublets: action.payload,
        sublet_search_results: action.payload,
      }
    case SELECT_POPUP_BUILDING:
      return {
        ...state,
        popup_buildings: action.payload ? findAllMatchingGPS(action.payload, action.payload.post_id ? state.sublets : state.buildings) : [],
      }
    case FILTERED_SUBLETS:
      return {
        ...state,
        sublet_search_results: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

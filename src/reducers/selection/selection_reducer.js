import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_POPUP_BUILDING,
  NAV_TOP_CONTEXT,
  NAV_BOTTOM_CONTEXT,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_building: null,
  selected_landlord: null,
  popup_building: null,       // for when you click on a pin and get quick info
  nav_top_context: '',        // for when you are in the <SuiteRoomBrowser> and changing the topContext
  nav_bottom_context: '',     // for when you are in the <SuiteRoomBrowser> and changing the bottomContext
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
    case NAV_TOP_CONTEXT:
      return {
        ...state,
        nav_top_context: action.payload,
      }
    case NAV_BOTTOM_CONTEXT:
      return {
        ...state,
        nav_bottom_context: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

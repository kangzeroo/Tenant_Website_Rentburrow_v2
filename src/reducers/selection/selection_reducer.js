import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_POPUP_BUILDING,
  SELECT_THREAD,
  NAV_TOP_TITLE,
  NAV_BOTTOM_TITLE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_building: {},
  selected_landlord: {},
  nav_top_title: '',        // for when you are in the <SuiteRoomBrowser> and changing the topContext
  nav_bottom_title: '',     // for when you are in the <SuiteRoomBrowser> and changing the bottomContext
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
    case SELECT_THREAD:
      let go_back = {
        selected_building: state.selected_building,
        selected_landlord: state.selected_landlord,
      }
      if (action.payload.length === 0) {
        go_back.selected_building = {}
        go_back.selected_landlord = {}
      }
      return {
        ...state,
        ...go_back,
      }
    case NAV_TOP_TITLE:
      return {
        ...state,
        nav_top_title: action.payload,
      }
    case NAV_BOTTOM_TITLE:
      return {
        ...state,
        nav_bottom_title: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

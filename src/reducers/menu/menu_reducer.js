import {
  TOGGLE_MENU_ON,
  TOGGLE_MENU_OFF,
} from '../../actions/action_types'

const INITIAL_STATE = {
  menu: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case TOGGLE_MENU_ON:
      return {
        ...state,
        menu: true,
      }
    case TOGGLE_MENU_OFF:
      return {
        ...state,
        menu: false,
      }
		default:
			return {
				...state
			}
	}
}

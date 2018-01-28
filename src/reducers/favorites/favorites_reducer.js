import {
  SAVE_FAVORITES,
  SAVE_BUILDING_FAVORITES,
} from '../../actions/action_types'

const INITIAL_STATE = {
  favorites: [],
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_FAVORITES:
      return {
        ...state,
        tenant_favorites: action.payload,
        favorites_loaded: true,
      }
    case SAVE_BUILDING_FAVORITES:
      return {
        ...state,
        building_favorites: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

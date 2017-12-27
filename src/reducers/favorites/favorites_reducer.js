import {
  SAVE_FAVORITES,
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
		default:
			return {
				...state
			}
	}
}

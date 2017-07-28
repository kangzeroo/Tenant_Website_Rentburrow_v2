// The selection reducer is all about any selections the user makes
// thus giving context to our app
// eg. I am browsing through buildings and I select 330 Spruce St

import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_SUITE,
  SELECT_ROOMS,
} from '../../actions/action_types'

const INITIAL_STATE = {
	current_building: {
    // building_id: 25245921949
  },
  current_suite: {
    // suite_id: 23485339549
  },
  current_corporation: {
    // corporation_id: '33cc0669-f407-4470-bb26-5e43742e3758'
  },
  current_rooms: []
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SELECT_BUILDING:
			return {
				...state,
				current_building: action.payload
			}
		case SELECT_SUITE:
			return {
				...state,
				current_suite: action.payload
			}
    case SELECT_CORPORATION:
			return {
				...state,
				current_corporation: action.payload
			}
    case SELECT_ROOMS:
      return {
        ...state,
        current_rooms: action.payload
      }
		default:
			return {
				...state
			}
	}
}

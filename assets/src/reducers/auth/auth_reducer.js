// everything to do with authentication
// authentication of staff and corporation

import {
  AUTHENTICATED_STAFF,
  UNAUTHENTICATED_STAFF,
	SET_CORPORATION_PROFILE,
	SET_STAFF_PROFILE,
	UNSET_STAFF_PROFILE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  authenticated_staff: false,
	corporation_profile: {
		// corporation_id: '99cc0669-f407-4470-bb26-5e43742e3758',
		// corporation_name: 'Jake Malliaros',
	},
	staff_profile: {
    // corporation_id: null,
    // created_at: '2017-07-11T02:54:03.142Z',
    // email: 'kangze.web.lance@gmail.com',
    // name: 'Khan Huang',
    // phone: '24859357437',
    // staff_id: '5d7b0bd0-4ce1-4c9b-b860-02cf79667952',
	}
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case AUTHENTICATED_STAFF:
      return {
        ...state,
        authenticated_staff: true
      }
    case UNAUTHENTICATED_STAFF:
      return {
        ...state,
        authenticated_staff: false,
        staff_profile: {},
      }
		case SET_CORPORATION_PROFILE:
			return {
				...state,
				corporation_profile: action.payload
			}
		case SET_STAFF_PROFILE:
			return {
				...state,
				staff_profile: action.payload
			}
		case UNSET_STAFF_PROFILE:
			return {
				...state,
				staff_profile: {},
				corporation_profile: {},
			}
		default:
			return {
				...state
			}
	}
}

import {
  AUTHENTICATE_TENANT,
} from '../../actions/action_types'

const INITIAL_STATE = {
  tenant_profile: {},
  authenticated: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case AUTHENTICATE_TENANT:
      return {
        ...state,
        tenant_profile: action.payload,
        authenticated: true,
      }
		default:
			return {
				...state
			}
	}
}

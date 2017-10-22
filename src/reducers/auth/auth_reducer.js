import {
  AUTHENTICATE_TENANT,
  FORCE_SIGNIN,
  LOGOUT_TENANT,
  LOCATION_FORWARDING,
} from '../../actions/action_types'

const INITIAL_STATE = {
  tenant_profile: {},
  authenticated: false,
  force_signin: false,
  location_forwarding: '',    // forwarding location after sign in
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case AUTHENTICATE_TENANT:
      return {
        ...state,
        tenant_profile: action.payload,
        authenticated: !action.payload.unauthRoleStudent,
      }
    case LOGOUT_TENANT:
      return {
        ...state,
        tenant_profile: {},
        authenticated: false,
      }
    case FORCE_SIGNIN:
      return {
        ...state,
        force_signin: action.payload,
      }
    case LOCATION_FORWARDING:
      return {
        ...state,
        location_forwarding: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

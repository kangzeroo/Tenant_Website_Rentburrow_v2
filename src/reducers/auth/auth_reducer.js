import {
  AUTHENTICATE_TENANT,
  FORCE_SIGNIN,
  LOGOUT_TENANT,
  LOCATION_FORWARDING,
  FINGERPRINT_BROWSER,
  FORCE_SIGNIN_FAVORITE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  tenant_profile: {},
  authenticated: false,
  force_signin: false,
  temporary_favorite_force_signin: '',
  location_forwarding: '',    // forwarding location after sign in
  browser_fingerprint: '',    // unique identifier for web browser
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case AUTHENTICATE_TENANT:
      return {
        ...state,
        tenant_profile: action.payload,
        authenticated: action.payload.unauthRoleStudent ? false : true,
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
    case FINGERPRINT_BROWSER:
      return {
        ...state,
        browser_fingerprint: action.payload,
      }
    case FORCE_SIGNIN_FAVORITE:
      return {
        ...state,
        temporary_favorite_force_signin: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

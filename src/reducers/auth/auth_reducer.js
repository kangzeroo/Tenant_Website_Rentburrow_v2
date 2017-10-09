import {
  AUTHENTICATE_TENANT,
  FORCE_SIGNIN,
  LOGOUT_TENANT,
} from '../../actions/action_types'

const INITIAL_STATE = {
  tenant_profile: {},
  authenticated: false,
  force_signin: false,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case AUTHENTICATE_TENANT:
      return {
        ...state,
        tenant_profile: action.payload,
        authenticated: true,
      }
    case LOGOUT_TENANT:
      return {
        ...state,
        authenticated: false,
      }
    case FORCE_SIGNIN:
      return {
        ...state,
        force_signin: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

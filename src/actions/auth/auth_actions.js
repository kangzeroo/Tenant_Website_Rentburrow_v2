import {
  AUTHENTICATE_TENANT,
  FORCE_SIGNIN,
  LOGOUT_TENANT,
  LOCATION_FORWARDING,
  FINGERPRINT_BROWSER,
  FORCE_SIGNIN_FAVORITE,
  // LISTEN_TO_FIREBASE_DB,
} from '../action_types'

// if there is a failure, we send this to Redux
export const saveTenantToRedux = (tenantProfile) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE_TENANT,
      payload: tenantProfile,
    })
    localStorage.setItem('tenant_id', tenantProfile.tenant_id)
		// dispatch({
		// 	type: LISTEN_TO_FIREBASE_DB,
		// 	payload: tenantProfile.tenant_id,
		// })
  }
}

export const logoutTenant = () => {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_TENANT,

    })
  }
}

// control if the forced signin popup should show
export const triggerForcedSignin = (bool) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: FORCE_SIGNIN,
      payload: bool,
    })
  }
}

// forward url
export const forwardUrlLocation = (url) => {
  return (dispatch) => {
    dispatch({
      type: LOCATION_FORWARDING,
      payload: url,
    })
  }
}

// fingerprint browser
export const fingerprintBrowser = (fingerprint_string) => {
  return (dispatch) => {
    dispatch({
      type: FINGERPRINT_BROWSER,
      payload: fingerprint_string,
    })
  }
}

// control if the forced signin popup should show
export const triggerForcedSigninFavorite = (obj) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: FORCE_SIGNIN_FAVORITE,
      payload: obj,
    })
  }
}

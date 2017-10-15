import {
  AUTHENTICATE_TENANT,
  FORCE_SIGNIN,
  LOGOUT_TENANT,
  LOCATION_FORWARDING,
} from '../action_types'

// if there is a failure, we send this to Redux
export const saveTenantToRedux = (tenantProfile) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATE_TENANT,
      payload: tenantProfile,
    })
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

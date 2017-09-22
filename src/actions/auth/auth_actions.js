import {
  AUTHENTICATE_TENANT,
  FORCE_SIGNIN,
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

import {
  AUTHENTICATE_TENANT,
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

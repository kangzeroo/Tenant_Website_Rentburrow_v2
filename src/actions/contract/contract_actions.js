import {
  I_APPLIED,
  APPLIED_TO_ME,
} from '../action_types'


export const saveSentApplicationsToRedux = (apps) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: I_APPLIED,
      payload: apps.map((x) => {
        return {
          ...x,
        }
      }),
    })
  }
}

export const saveReceivedApplicationsToRedux = (apps) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: APPLIED_TO_ME,
      payload: apps.map((x) => {
        return {
          ...x,
        }
      }),
    })
  }
}
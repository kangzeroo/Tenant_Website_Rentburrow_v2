import {
  I_APPLIED,
  APPLIED_TO_ME,
  APPLY_FOR_THIS_BUILDING,
  APPLIED_LEASES,
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

export const saveLeaseApplicationsToRedux = (apps) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: APPLIED_LEASES,
      payload: apps.map((x) => {
        return {
          ...x,
        }
      }),
    })
  }
}

export const applyToLiveAtThisBuilding = (building) => {
  return (dispatch) => {
    dispatch({
      type: APPLY_FOR_THIS_BUILDING,
      payload: building,
    })
  }
}

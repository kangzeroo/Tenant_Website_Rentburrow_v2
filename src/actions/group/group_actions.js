import {
  GROUP_MEMBERS,
  MY_LEASE_APPLICATION,
  MY_APPLIED_BUILDING,
} from '../action_types'


export const saveGroupApplicationToRedux = (group) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: GROUP_MEMBERS,
      payload: group.map((x) => {
        return {
          ...x,
        }
      }),
    })
  }
}


export const saveMyApplicationToRedux = (app_id) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: MY_LEASE_APPLICATION,
      payload: app_id,
    })
  }
}

export const saveAppliedBuildingToRedux = (data) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: MY_APPLIED_BUILDING,
      payload: data,
    })
  }
}

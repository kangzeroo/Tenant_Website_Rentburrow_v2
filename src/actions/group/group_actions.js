import {
  GROUP_MEMBERS,
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

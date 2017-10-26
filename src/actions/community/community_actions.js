import {
  SELECT_LOCAL,
} from '../action_types'

// if there is a failure, we send this to Redux
export const selectLocal = (local) => {
  // console.log(local)
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SELECT_LOCAL,
      payload: local,
    })
  }
}

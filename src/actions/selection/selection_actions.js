import {
  SELECT_BUILDING,
} from '../action_types'

export const selectBuilding = (building) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SELECT_BUILDING,
      payload: building,
    })
  }
}

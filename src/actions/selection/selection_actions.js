import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_POPUP_BUILDING,
  NAV_BOTTOM_CONTEXT,
  NAV_TOP_CONTEXT,
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

export const selectPopupBuilding = (building) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SELECT_POPUP_BUILDING,
      payload: building,
    })
  }
}

export const selectCorporation = (corp) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_CORPORATION,
      payload: corp,
    })
  }
}

export const selectTopContext = (context) => {
  return (dispatch) => {
    dispatch({
      type: NAV_TOP_CONTEXT,
      payload: context,
    })
  }
}

export const selectBottomContext = (context) => {
  return (dispatch) => {
    dispatch({
      type: NAV_BOTTOM_CONTEXT,
      payload: context,
    })
  }
}

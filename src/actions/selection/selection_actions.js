import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_POPUP_BUILDING,
  NAV_BOTTOM_TITLE,
  NAV_TOP_TITLE,
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

export const selectTopTitle = (context) => {
  return (dispatch) => {
    dispatch({
      type: NAV_TOP_TITLE,
      payload: context,
    })
  }
}

export const selectBottomTitle = (context) => {
  return (dispatch) => {
    dispatch({
      type: NAV_BOTTOM_TITLE,
      payload: context,
    })
  }
}

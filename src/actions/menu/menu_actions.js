import {
  TOGGLE_MENU_ON,
  TOGGLE_MENU_OFF,
} from '../action_types'

export const toggleMenuOn = () => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_MENU_ON,
      payload: true,
    })
  }
}

export const toggleMenuOff = () => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: TOGGLE_MENU_OFF,
      payload: false,
    })
  }
}

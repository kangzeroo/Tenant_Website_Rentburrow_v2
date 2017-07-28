import {
  TOGGLE_ACCOUNT_POPUP,
} from '../action_types'

// toggle the staff account popup
export const toggleAccountPopup = (bool) => {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_ACCOUNT_POPUP,
      payload: bool
    })
  }
}

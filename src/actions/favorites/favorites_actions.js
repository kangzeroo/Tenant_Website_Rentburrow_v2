import {
  SAVE_FAVORITES,
} from '../action_types'


export const saveFavoritesToRedux = (favorites) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: SAVE_FAVORITES,
      payload: favorites.map((x) => {
        return {
          ...x,
        }
      }),
    })
  }
}

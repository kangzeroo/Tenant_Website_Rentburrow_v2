import {
  FOUND_BUILDINGS,
  CHANGE_CARD_STYLE,
  SELECT_PIN,
  SEARCH_STRING,
} from '../action_types'

// if there is a failure, we send this to Redux
export const saveBuildingsToRedux = (buildings) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: FOUND_BUILDINGS,
      payload: buildings.map((building) => {
        const x = JSON.parse(building)
        return {
          ...x,
          gps_x: parseFloat(x.gps_x),
          gps_y: parseFloat(x.gps_y),
          max_price: parseFloat(x.max_price),
          min_price: parseFloat(x.min_price),
        }
      }),
    })
  }
}

// determine what style of card to show (row, grid, cover)
export const changeCardStyle = (style) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: CHANGE_CARD_STYLE,
      payload: style,
    })
  }
}

// select a pin on map
export const selectPinToRedux = (pin) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_PIN,
      payload: pin,
    })
  }
}

// select a pin on map
export const searchByString = (string) => {
  return (dispatch) => {
    dispatch({
      type: SEARCH_STRING,
      payload: string,
    })
  }
}

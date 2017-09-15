import {
  FOUND_BUILDINGS,
  FOUND_SUBLETS,
  CHANGE_CARD_STYLE,
  SELECT_PIN,
  SEARCH_STRING,
  SAVE_LEASE_FILTER_PARAMS,
  SAVE_SUBLET_FILTER_PARAMS,
  CHANGE_RENT_TYPE,
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

// save sublets to Redux
export const saveSubletsToRedux = (sublets) => {
  return (dispatch) => {
    dispatch({
      type: FOUND_SUBLETS,
      payload: sublets,
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

// toggle search type between lease or sublet
export const changeRentType = (rentType) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_RENT_TYPE,
      payload: rentType,
    })
  }
}


// save the lease filter params so that it persists even when the <FilterCard> component unmounts and remounts
export const saveLeaseFilterParams = (params) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_LEASE_FILTER_PARAMS,
      payload: params,
    })
  }
}

// save the sublet filter params so that it persists even when the <FilterCard> component unmounts and remounts
export const saveSubletFilterParams = (params) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_SUBLET_FILTER_PARAMS,
      payload: params,
    })
  }
}

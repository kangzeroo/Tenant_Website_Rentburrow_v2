import {
  SAVE_BUILDINGS,
} from '../action_types'

// save this corporation's buildings to redux
export const saveBuildingsForCorp = (buildings) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_BUILDINGS,
      payload: buildings.map((building) => { return JSON.parse(building) }),
    })
  }
}

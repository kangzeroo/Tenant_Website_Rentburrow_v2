import {
  SELECT_BUILDING,
  SELECT_CORPORATION,
  SELECT_SUITE,
  SELECT_ROOMS,
} from '../action_types'

// staff member selects a building
export const selectBuilding = (building) => {
	return (dispatch) => {
		dispatch({
			type: SELECT_BUILDING,
			payload: building
		})
	}
}

// staff member selects a suite
export const selectSuite = (suite) => {
	return (dispatch) => {
		dispatch({
			type: SELECT_SUITE,
			payload: suite
		})
	}
}

// staff member selects a corporation
export const selectCorporation = (corporation) => {
	return (dispatch) => {
		dispatch({
			type: SELECT_CORPORATION,
			payload: corporation
		})
	}
}

export const selectRooms = (rooms) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_ROOMS,
      payload: rooms,
    })
  }
}

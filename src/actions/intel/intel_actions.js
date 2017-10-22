import { COLLECT_INTEL, CLEAR_INTEL_LIST, SAVE_INTEL_TO_CLOUD } from '../action_types'

export const collectIntel = (record) => {
	return (dispatch) => {
		// console.log(record)
		dispatch({
			type: COLLECT_INTEL,
			payload: record
		})
	}
}

export const clearIntelList = () => {
  return (dispatch) => {
		dispatch({
			type: CLEAR_INTEL_LIST
		})
	}
}

export const saveIntelToCloud = () => {
	return (dispatch) => {
		dispatch({
			type: SAVE_INTEL_TO_CLOUD
		})
	}
}

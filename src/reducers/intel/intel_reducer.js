import { COLLECT_INTEL, CLEAR_INTEL_LIST } from '../../actions/action_types'

const INITIAL_STATE = {
	collectedRawIntel: []
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case COLLECT_INTEL:
			return {
				...state,
				collectedRawIntel: state.collectedRawIntel.concat([action.payload])
			}
    case CLEAR_INTEL_LIST:
      return {
        ...state,
        collectedRawIntel: []
      }
    default:
      return state
	}
}

import { COLLECT_INTEL, CLEAR_INTEL_LIST, SAVE_INTEL_TO_CLOUD } from '../../actions/action_types'
import { sendOffToDynamoDB } from '../../api/intel/intel_api'

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
		case SAVE_INTEL_TO_CLOUD:
			sendOffToDynamoDB(state.collectedRawIntel)
			return {
				...state,
				collectedRawIntel: []
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

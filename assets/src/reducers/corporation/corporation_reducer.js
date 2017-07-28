// everything to do with the corporation

import {
	SAVE_BUILDINGS,
	SET_CORPORATION_S3_BUCKET,
} from '../../actions/action_types'

const INITIAL_STATE = {
	buildings: [],
	s3_corporation: '',
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SAVE_BUILDINGS:
			return {
				...state, // spread operator
				buildings: action.payload,
			}
		case SET_CORPORATION_S3_BUCKET:
			return {
				...state,
				s3_corporation: action.payload
			}
		default:
			return {
				...state
			}
	}
}

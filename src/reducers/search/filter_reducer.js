import {
  SAVE_LEASE_FILTER_PARAMS,
  SAVE_SUBLET_FILTER_PARAMS,
  CHANGE_RENT_TYPE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  lease_filter_params: {
    price: {
      min: 500,
      max: 900,
    },
    room_count: 0,
    ensuite_bath: false,
    utils_incl: false,
    parking_avail: false,
  },
  sublet_filter_params: {

  },
  rent_type: 'lease',     // 'lease' or 'sublet'
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SAVE_LEASE_FILTER_PARAMS:
      return {
        ...state,
        lease_filter_params: action.payload,
      }
    case SAVE_SUBLET_FILTER_PARAMS:
      return {
        ...state,
        sublet_filter_params: action.payload,
      }
    case CHANGE_RENT_TYPE:
      return {
        ...state,
        rent_type: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

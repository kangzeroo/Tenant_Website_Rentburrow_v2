import {
  SAVE_LEASE_FILTER_PARAMS,
  SAVE_SUBLET_FILTER_PARAMS,
  CHANGE_RENT_TYPE,
  SET_CURRENT_GPS_CENTER,
  UPDATE_SEARCH_RADIUS,
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
    search_radius: 1000,
  },
  sublet_filter_params: {
    price: {
      min: 500,
      max: 900,
    },
    room_count: 1,
    ensuite_bath: false,
    utils_incl: false,
    female_only: false,
    search_radius: 1000,
  },
  rent_type: 'lease',     // 'lease' or 'sublet'
  current_gps_center: {
    lat: 43.473897,
    lng: -80.531995,
  },
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
    case SET_CURRENT_GPS_CENTER:
      return {
        ...state,
        current_gps_center: action.payload,
      }
    case UPDATE_SEARCH_RADIUS:
      return {
        ...state,
        lease_filter_params: {
          ...state.lease_filter_params,
          search_radius: action.payload,
        },
        sublet_filter_params: {
          ...state.sublet_filter_params,
          search_radius: action.payload,
        }
      }
		default:
			return {
				...state
			}
	}
}

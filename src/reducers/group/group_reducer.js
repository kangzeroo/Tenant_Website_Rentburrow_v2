import {
  GROUP_MEMBERS,
  MY_LEASE_APPLICATION,
  MY_APPLIED_BUILDING,
} from '../../actions/action_types'

const INITIAL_STATE = {
  group_members: [],
  my_application_id: '',
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case GROUP_MEMBERS:
      return {
        ...state,
        group_members: action.payload,
      }
    case MY_LEASE_APPLICATION:
      return {
        ...state,
        my_application_id: action.payload,
      }
    case MY_APPLIED_BUILDING:
      return {
        ...state,
        selected_building: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

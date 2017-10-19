import {
  GROUP_MEMBERS,
} from '../../actions/action_types'

const INITIAL_STATE = {
  group_members: []
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case GROUP_MEMBERS:
      return {
        ...state,
        group_members: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

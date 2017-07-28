import { combineReducers } from 'redux'
import staffReducer from './staff/staff_reducer'
import corporationReducer from './corporation/corporation_reducer'
import selectionReducer from './selection/selection_reducer'
import messageReducer from './messaging/messaging_reducer'
import authReducer from './auth/auth_reducer'

// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	auth: authReducer,
	staff: staffReducer,
	corporation: corporationReducer,
	selection: selectionReducer,
	messaging: messageReducer,
})

export default rootReducer

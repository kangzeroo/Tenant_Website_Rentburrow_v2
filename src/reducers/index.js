import { combineReducers } from 'redux'
import authReducer from './auth/auth_reducer'
import communityReducer from './community/community_reducer'
import searchReducer from './search/search_reducer'
import selectionReducer from './selection/selection_reducer'
import messageReducer from './messaging/messaging_reducer'
import appReducer from './app/app_reducer'

// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	community: communityReducer,
	messaging: messageReducer,
	search: searchReducer,
	selection: selectionReducer,
})

export default rootReducer

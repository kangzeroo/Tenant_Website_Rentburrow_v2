import { combineReducers } from 'redux'
import communityReducer from './community/community_reducer'
import searchReducer from './search/search_reducer'

// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	community: communityReducer,
	search: searchReducer,
})

export default rootReducer

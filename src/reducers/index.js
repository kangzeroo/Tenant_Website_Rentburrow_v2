import { combineReducers } from 'redux'
import authReducer from './auth/auth_reducer'
import communityReducer from './community/community_reducer'
import contractReducer from './contract/contract_reducer'
import searchReducer from './search/search_reducer'
import filterReducer from './search/filter_reducer'
import selectionReducer from './selection/selection_reducer'
import messageReducer from './messaging/messaging_reducer'
import toastsReducer from './messaging/toasts_reducer'
import intelReducer from './intel/intel_reducer'
import appReducer from './app/app_reducer'
import leaseAppReducer from './contract/lease_application_reducer'
import leasePaymentReducer from './contract/lease_payment_reducer'
import groupReducer from './group/group_reducer'
import favoritesReducer from './favorites/favorites_reducer'

// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	community: communityReducer,
	messaging: messageReducer,
	toasts: toastsReducer,
	search: searchReducer,
	filter: filterReducer,
	selection: selectionReducer,
	intel: intelReducer,
	contract: contractReducer,
	leaseApp: leaseAppReducer,
	leasePay: leasePaymentReducer,
	group: groupReducer,
	favorites: favoritesReducer,
})

export default rootReducer

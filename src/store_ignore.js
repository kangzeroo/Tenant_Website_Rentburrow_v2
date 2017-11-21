import { createLogger } from 'redux-logger'
import {
	COLLECT_INTEL,
} from './actions/action_types'

// paste Redux actions here and you will see their change log on the chrome console
// be sure to import the actions
const listOfBlacklisted = [
	COLLECT_INTEL,
]

// function to send those change logs onto chrome console
const filteredLogger = createLogger({
	predicate: (getState, action) => {
		// toggle allow = true
		let allow = false
		listOfBlacklisted.forEach((black) => {
			if (black === action.type) {
				allow = true
			}
		})
		return allow
	}
})

export default filteredLogger

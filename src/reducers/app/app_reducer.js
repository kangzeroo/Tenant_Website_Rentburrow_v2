import {
  CHANGE_LANGUAGE,
  CHANGE_HTML_TITLE,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_language: 'en',
  html_title: 'RentHero Student Housing in Waterloo has the Best Off Campus Housing and Student Rentals for UW, WLU, and Conestoga',
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        selected_language: action.payload,
      }
    case CHANGE_HTML_TITLE:
      return {
        ...state,
        html_title: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

import {
  CHANGE_LANGUAGE,
  CHANGE_HTML_TITLE,
  CHANGE_META_THUMBNAIL,
} from '../../actions/action_types'

const INITIAL_STATE = {
  selected_language: 'en',
  html_title: 'RentHero Student Housing in Waterloo has the Most Off Campus Housing and Student Rentals for UW, WLU, and Conestoga',
  meta_thumbnail: 'https://s3.amazonaws.com/rentburrow-static-assets/Logos/rentheroLogo.png',
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
    case CHANGE_META_THUMBNAIL:
      return {
        ...state,
        meta_thumbnail: action.payload,
      }
		default:
			return {
				...state
			}
	}
}

import {
  CHANGE_LANGUAGE,
  CHANGE_HTML_TITLE,
} from '../action_types'

// change the language of the app
export const changeAppLanguage = (languageCode) => {
  // dispatch lets you send actions to Redux
  localStorage.setItem('rentburrow_lang', languageCode)
  return (dispatch) => {
    dispatch({
      type: CHANGE_LANGUAGE,
      payload: languageCode,
    })
  }
}

// change the language of the app
export const changeHTMLTitle = (title) => {
  // dispatch lets you send actions to Redux
  return (dispatch) => {
    dispatch({
      type: CHANGE_HTML_TITLE,
      payload: title,
    })
  }
}

  import axios from 'axios'
  import { GENERIC_MICROSERVICE } from '../../api/API_URLS'
  import {
    SAVE_BUILDING,
    ERROR,
  } from '../action_types'

  // if there is a failure, we send this to Redux
  export const errorOccurred = (err) => {
    // dispatch lets you send actions to Redux
    return (dispatch) => {
      dispatch({
        type: ERROR,
        payload: err,
      })
    }
  }

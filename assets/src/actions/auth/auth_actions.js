import {
  AUTHENTICATED_STAFF,
  UNAUTHENTICATED_STAFF,
  SET_STAFF_PROFILE,
  UNSET_STAFF_PROFILE,
  SET_CORPORATION_PROFILE,
  SET_CORPORATION_S3_BUCKET,
} from '../action_types'
import { createUserS3Album } from '../../api/aws/aws-S3'

// authenticate the staff members' account
export const authenticateStaff = () => {
  return (dispatch) => {
    dispatch({
      type: AUTHENTICATED_STAFF
    })
  }
}

// unauthenticate the staff members' account
export const unauthenticateStaff = () => {
  return (dispatch) => {
    dispatch({
      type: UNAUTHENTICATED_STAFF
    })
  }
}

// set the staff members' profile
export const setStaffProfile = (staff) => {
	return (dispatch) => {
		dispatch({
			type: SET_STAFF_PROFILE,
			payload: staff
		})
	}
}

// remove the staff members' profile
export const removeStaffProfile = () => {
	return (dispatch) => {
    localStorage.removeItem('cognito_staff_token')
		dispatch({
			type: UNSET_STAFF_PROFILE
		})
	}
}

// save the corporations' profile
export const saveCorporationProfile = (corporation) => {
	return (dispatch) => {
    createUserS3Album(corporation).then((albumKey) => {
  		dispatch({
  			type: SET_CORPORATION_S3_BUCKET,
  			payload: albumKey
  		})
    }).catch((err) => {
      dispatch({
  			type: SET_CORPORATION_S3_BUCKET,
  			payload: null
  		})
    })
		dispatch({
			type: SET_CORPORATION_PROFILE,
			payload: corporation
		})
	}
}

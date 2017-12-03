import {
  ADD_TOAST,
	REMOVE_TOAST,
} from '../action_types'


export const addToastMessage = (toast) => {
	return (dispatch) => {
		dispatch({
			type: ADD_TOAST,
			payload: toast
		})
    // const example_toast = {
    //   id: 'alsdfjasf',
    //   title: 'Alert!',
    //   text: 'This is a toast message',
    //   color: 'blue',
    //   link: 'https://localhost:8081/contact',
    //   icon: 'phone'
    // }
	}
}

export const removeToastMessage = (toastId) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_TOAST,
			payload: toastId
		})
	}
}

import axios from 'axios'
import { CORP_MICROSERVICE } from '../API_URLS'

// save the corporation to server and await for response
export const getStaffInfo = (staffID) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CORP_MICROSERVICE}/get_staff_info`, { staff_id: staffID })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const updateStaffThumbnailPhoto = ({ staff_id, thumbnail }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CORP_MICROSERVICE}/update_staff_thumbnail_photo`, { staff_id, thumbnail })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

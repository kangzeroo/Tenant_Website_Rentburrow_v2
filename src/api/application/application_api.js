import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'

// get sublet from dynamodb based off facebook post_id
export const getSentApplications = (student_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_sent_applications`, { student_id, })
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

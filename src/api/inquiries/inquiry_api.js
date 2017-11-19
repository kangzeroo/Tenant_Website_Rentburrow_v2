import axios from 'axios'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'

// get sublet from dynamodb based off facebook post_id
export const insertInquiry = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/insert_inquiry`, obj)
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

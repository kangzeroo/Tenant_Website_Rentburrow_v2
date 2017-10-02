import axios from 'axios'
import { INTEL_MICROSERVICE } from '../API_URLS'

// send to API
export const sendOffToDynamoDB = (organizedCollection) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${INTEL_MICROSERVICE}/heartbeat`, organizedCollection)
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
  })
  return p
}

import axios from 'axios'
import CryptoJS from 'crypto-js'
import { INTEL_MICROSERVICE } from '../API_URLS'
// import authHeaders from '../authHeaders'

// send to API
export const sendOffToDynamoDB = (organizedCollection) => {
  const p = new Promise((res, rej) => {
    const encryptedIntel = CryptoJS.AES.encrypt(JSON.stringify(organizedCollection), 'heartbeatIsStronk').toString()
    axios.post(`${INTEL_MICROSERVICE}/heartbeat`, { heartbeat: encryptedIntel })
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

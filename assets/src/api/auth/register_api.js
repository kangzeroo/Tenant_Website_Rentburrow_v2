import axios from 'axios'
import { REGISTER_MICROSERVICE } from '../API_URLS'

// save the registration info to server and await for response
export const sendRegisterInfo = (regObj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${REGISTER_MICROSERVICE}/post_register_info`, regObj)
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data)
        res(data.data.message)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

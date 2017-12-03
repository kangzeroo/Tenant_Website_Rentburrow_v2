import axios from 'axios'
import { REGISTER_MICROSERVICE } from '../API_URLS'

// save the registration info to server and await for response
export const sendRegisterInfo = ({ tenant_id, email, name, phone }) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${REGISTER_MICROSERVICE}/post_tenant_info`, { staff_id, email, name, corporation_id, staff_title, temp_pass, accessToken })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     console.log(data)
    //     res(data.data.message)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
  })
  return p
}

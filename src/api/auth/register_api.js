import axios from 'axios'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

// save the registration info to server and await for response
export const sendRegisterInfo = ({ tenant_id, email, first_name, last_name, phone }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/register_tenant`, { tenant_id, email, first_name, last_name, phone, }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data)
        res(data.data.message)
      })
      .catch((err) => {
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
        rej(err)
      })
  })
  return p
}

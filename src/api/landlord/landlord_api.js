import axios from 'axios'
import { LANDLORD_RESPONSIVENESS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const checkLandlordResponsiveness = (landlord_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${LANDLORD_RESPONSIVENESS_MICROSERVICE}/get_responsiveness_stats`, { landlord_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data)
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

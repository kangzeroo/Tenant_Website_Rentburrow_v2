import axios from 'axios'
import { ANALYTICS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'


export const getBuildingViews = (building_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${ANALYTICS_MICROSERVICE}/building_stats`, { building_id }, authHeaders())
      .then((data) => {
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

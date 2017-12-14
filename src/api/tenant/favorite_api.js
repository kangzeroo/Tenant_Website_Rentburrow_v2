import axios from 'axios'
import https from 'https'
import { SEARCH_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const saveFavorite = (building_id, tenant_id, bool) => {
  console.log('saveFavorite: ', building_id, tenant_id, bool)
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/toggle_favorite`, { building_id, tenant_id, bool }, authHeaders()) // { httpsAgent: agent })
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

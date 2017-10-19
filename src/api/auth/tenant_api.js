import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'

// save tenant profile
export const saveTenantProfile = (fbProfile) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/insert_tenant_profile`, fbProfile)
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

export const updateTenantProfile = (profile) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/update_tenant_profile`, profile)
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

export const getTenantProfile = ({ tenant_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_tenant_profile`, { tenant_id, })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const saveTenantDetails = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/save_tenant_details`, obj)
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

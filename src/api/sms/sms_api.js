import axios from 'axios'
import { SMS_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const sendSMSToBothParties = (contents) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/initial`, contents)
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


export const insertTenantLandlordSMS = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/insert_tenant_landlord_sms`, obj)
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

export const getLandlordInfo = (building_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/get_landlord_info`, { building_id: building_id, })
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

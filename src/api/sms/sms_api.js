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
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
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
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
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
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
        rej(err)
      })
  })
  return p
}

export const sendInitialMessage = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/initial_inquiry`, obj)
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

export const sendInitialCorporateInquiry = ({ tenant, building, suite, corporation, group, inquiry_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/initial_corporate_inquiry`, { tenant, building, suite, corporation, group, inquiry_id, })
      .then((data) => {
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const sendTenantWaitMsg = ({ tenant, building, suite, group_notes, group_size, corporation_email, corporation_id, inquiry_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/send_tenant_wait_msg`, { tenant, building, suite, group_notes, group_size, corporation_email, corporation_id, inquiry_id, })
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

export const verifyPhone = (phone) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SMS_MICROSERVICE}/phone_lookup`, { phone, })
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

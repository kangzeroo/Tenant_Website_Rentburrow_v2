import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'
import { encryptCommunication, decryptCommunication } from '../aws/aws-kms'

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
        res(data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getTenantDetails = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_tenant_details`, { tenant_id, })
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

export const insertStudentCard = ({ tenant_id, student_card }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/insert_tenant_student_card`, { tenant_id, student_card })
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

export const getStudentCard = ({ tenant_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_tenant_student_card`, { tenant_id })
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

export const getTenantByEmail = (email) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_tenant_by_email`, { email })
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

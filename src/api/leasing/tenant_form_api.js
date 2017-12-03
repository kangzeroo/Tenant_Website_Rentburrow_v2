import axios from 'axios'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const getGuarantorInfo = (application_id, tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_guarantor_information`, { application_id, tenant_id, }, authHeaders())
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

export const getAboutMe = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_about_me`, { tenant_id, }, authHeaders())
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

export const getSuiteRankings = (group_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_suite_rankings`, { group_id, }, authHeaders())
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

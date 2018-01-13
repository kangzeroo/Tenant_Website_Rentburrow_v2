import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const getSentApplications = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_sent_applications`, { tenant_id, }, authHeaders())
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

export const getReceivedApplications = (tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_received_applications`, { tenant_id, }, authHeaders())
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


export const getQuickSubletorContractLink = (contract_id, tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_quick_subletor_contract_link`, { contract_id, tenant_id, }, authHeaders())
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

export const getQuickSubleteeContractLink = (contract_id, tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_quick_subletee_contract_link`, { contract_id, tenant_id, }, authHeaders())
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

import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'

export const getSentApplications = (student_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_sent_applications`, { student_id, })
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

export const getReceivedApplications = (student_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_received_applications`, { student_id, })
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


export const getQuickSubletorContractLink = (contract_id, student_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_quick_subletor_contract_link`, { contract_id, student_id, })
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

export const getQuickSubleteeContractLink = (contract_id, student_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_quick_subletee_contract_link`, { contract_id, student_id, })
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

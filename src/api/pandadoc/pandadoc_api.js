import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'

export const generateContract = (contract_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/generate_contract`, { contract_id })
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

export const authenticatePandaDoc = (code) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/pandadoc_authentication`, { code })
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

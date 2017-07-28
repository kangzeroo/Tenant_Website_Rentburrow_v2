import axios from 'axios'
import { CORP_MICROSERVICE } from '../API_URLS'

// save the corporation to server and await for response
export const sendCorpInfo = (corpObj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CORP_MICROSERVICE}/post_corp_info`, corpObj)
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

export const getCorpInfo = (corpID) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CORP_MICROSERVICE}/get_corp_info`, { corporation_id: corpID })
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

export const updateCorporationThumbnail = ({ corp_id, thumbnail }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CORP_MICROSERVICE}/update_corp_thumbnail`, { corp_id, thumbnail })
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

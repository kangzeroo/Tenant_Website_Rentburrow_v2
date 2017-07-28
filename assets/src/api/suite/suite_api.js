import axios from 'axios'
import { BUILDING_MICROSERVICE } from '../API_URLS'

export const submitSuiteToDB = (suite) => {
  const p = new Promise((res, rej) => {
    console.log(suite)
    axios.post(`${BUILDING_MICROSERVICE}/post_suite_info`, suite)
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

export const getSuitesForBuilding = ({ building_id, corporation_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/get_suites_for_building`, { building_id, corporation_id })
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

export const updateSuiteThumbnailPhoto = ({ suite_id, images, thumbnail }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/update_suite_thumbnail_info`, { suite_id, images, thumbnail })
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

import axios from 'axios'
import { BUILDING_MICROSERVICE } from '../API_URLS'

// save the building to server and await for response
export const sendBuildingObj = (buildingObj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/post_building_info`, buildingObj)
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

export const getBuildingsForCorporation = (corpID) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/get_buildings_info`, { corporation_id: corpID })
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

export const updateBuildingThumbnailAndCoverPhotos = ({ building_id, images, thumbnail, banner_photo }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/update_building_thumbnail_cover_info`, { building_id, images, thumbnail, banner_photo })
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

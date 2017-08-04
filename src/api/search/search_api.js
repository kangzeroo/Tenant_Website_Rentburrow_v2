import axios from 'axios'
import { BUILDING_MICROSERVICE } from '../API_URLS'

export const getBuildingsInArea = ({ lat, long }) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${BUILDING_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${BUILDING_MICROSERVICE}/get_buildings_info`, { corporation_id: '33b5dfcc-7445-449c-8d31-e3d032d9ad19' })
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

// this should search for a specific building
// and if not found, throw an error
// currently just mocks a return
export const searchForSpecificBuilding = (building_id) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    // axios.post(`${BUILDING_MICROSERVICE}/get_specific_building`, { building_id: building_id })
    axios.post(`${BUILDING_MICROSERVICE}/get_buildings_info`, { corporation_id: '33b5dfcc-7445-449c-8d31-e3d032d9ad19' })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(JSON.parse(data.data[0]))
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

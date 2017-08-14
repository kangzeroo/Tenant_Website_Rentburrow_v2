import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'

export const getBuildingsInArea = ({ lat, long }) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/searchInArea`, { query_params: {} })
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
export const searchForSpecificBuilding = (urlPath) => {
  const p = new Promise((res, rej) => {
    const id = urlPath.slice(1)
    // search for a specific building from backend
    // axios.post(`${SEARCH_MICROSERVICE}/get_specific_building`, { building_id: building_id })
    axios.post(`${SEARCH_MICROSERVICE}/get_specific_building`, { building_id: id })
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

export const getSpecificLandlord = ({ corporation_id }) => {
  console.log('getSpecificLandlord')
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_specific_landlord`, { corporation_id })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(JSON.parse(data.data))
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

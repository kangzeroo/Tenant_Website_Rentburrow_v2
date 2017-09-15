import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'

// MOVE THIS TO THE GENERAL QUERY
export const filterBuildings = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/filter_buildings`, obj)
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

export const sortBuildings = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/sort_buildings`, obj)
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

export const filterSublets = (ob) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/filter_sublets`, obj)
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
    res([])
  })
  return p
}

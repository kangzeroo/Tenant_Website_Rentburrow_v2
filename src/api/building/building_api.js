import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'


export const getAllActiveBuildings = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_all_active_buildings`, obj)
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

export const getImagesForSpecificBuilding = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_images_for_specific_building`, obj)
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

export const getAmenitiesForSpecificBuilding = ({ building_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_amenities_for_specific_building`, { building_id })
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

export const getAvailableSuites = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_available_suites`, obj)
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

export const getAmenitiesForSuite = ({ building_id, suite_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_amenities_for_suite`, { building_id, suite_id })
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

export const getRoomsForSuite = ({ building_id, suite_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_all_rooms_for_suite`, { building_id, suite_id })
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

export const getSuiteInfo = ({ building_id, suite_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_suite_page`, { building_id, suite_id })
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

export const getRoomPage = ({ building_id, suite_id, room_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_room_page`, { building_id, suite_id, room_id })
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

export const getRoomAmenities = ({ building_id, suite_id, room_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_room_amenities`, { building_id, suite_id, room_id })
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

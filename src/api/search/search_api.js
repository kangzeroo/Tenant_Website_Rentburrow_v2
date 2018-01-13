import axios from 'axios'
import https from 'https'
import { SEARCH_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

const agent = new https.Agent({
  rejectUnauthorized: false
})

export const queryBuildingsInArea = (tenant_id) => { //{ lat, lng, filterParams }) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/get_all_active_buildings`, { tenant_id, }, authHeaders()) // { httpsAgent: agent })
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

// this should search for a specific building
// and if not found, throw an error
// currently just mocks a return
export const searchForSpecificBuilding = (urlPath) => {
  const p = new Promise((res, rej) => {
    const id = urlPath.slice(1)
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_specific_building`, { building_id: id }, authHeaders()) // { httpsAgent: agent })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
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

export const getBuildingById = (id) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_specific_building`, { building_id: id }, authHeaders()) // { httpsAgent: agent })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
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

// this should search for a specific building
// and if not found, throw an error
// currently just mocks a return
export const searchForSpecificBuildingByAlias = (urlPath, tenant_id) => {
  const p = new Promise((res, rej) => {
    const alias = urlPath.slice(1)
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_specific_building_by_alias`, { building_alias: alias, tenant_id, }, authHeaders()) // { httpsAgent: agent })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
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


// searches for buildings based on Google's place ID
export const searchBuildingByPlaceID = ({ place_id }) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_building_by_place_id`, { place_id, }, authHeaders()) // { httpsAgent: agent })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
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

export const searchBuildingByAddress = (addr) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_building_by_address`, addr, authHeaders()) // { httpsAgent: agent })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
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

export const getAllImagesSizeForSpecificBuilding = (building_id) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_all_images_size_for_specific_building`, { building_id, }, authHeaders()) // { httpsAgent: agent })
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

export const getAllSummaryImages = (building_id) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_all_summary_images`, { building_id, }, authHeaders()) // { httpsAgent: agent })
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

export const getNumVirtualTours = (building_id) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/get_num_virtual_tours`, { building_id, }, authHeaders()) // { httpsAgent: agent })
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


export const getSpecificLandlord = ({ building_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_specific_landlord`, { building_id }, authHeaders()) // { httpsAgent: agent })
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

export const getLandlordInfo = (building_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_landlord_info`, { building_id }, authHeaders()) // { httpsAgent: agent })
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

export const locallyFindBuildingById = (id, listOfResults) => {
  const founds = listOfResults.filter((l) => {
    return l.building_id === id || l.post_id === id
  })
  return founds[0]
}

import axios from 'axios'
import https from 'https'
import { SEARCH_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const saveFavorite = (building_id, tenant_id, bool) => {
  console.log('saveFavorite: ', building_id, tenant_id, bool)
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/toggle_favorite`, { building_id, tenant_id, bool }, authHeaders()) // { httpsAgent: agent })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    // _LTracker.push({
    //   'error': err,
    //   'tag' : `${localStorage.getItem('tenant_id')}`
    // })
    //     rej(err)
    //   })
  })
  return p
}

export const insertBuildingFavorite = (tenant_id, building_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/insert_building_favorite`, { tenant_id, building_id, }, authHeaders()) // { httpsAgent: agent })
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

export const insertSuiteFavorite = (tenant_id, building_id, suite_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/insert_suite_favorite`, { tenant_id, building_id, suite_id, }, authHeaders()) // { httpsAgent: agent })
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

export const deleteBuildingFavorite = (tenant_id, building_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/delete_building_favorite`, { tenant_id, building_id, }, authHeaders()) // { httpsAgent: agent })
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

export const deleteSuiteFavorite = (tenant_id, building_id, suite_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/delete_suite_favorite`, { tenant_id, building_id, suite_id, }, authHeaders()) // { httpsAgent: agent })
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

export const getAllFavoritesForTenant = (tenant_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/get_all_favorites_for_tenant`, { tenant_id, }, authHeaders()) // { httpsAgent: agent })
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

export const getTenantFavoriteForBuilding = (tenant_id, building_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${SEARCH_MICROSERVICE}/search_buildings`, { lat, long })
    axios.post(`${SEARCH_MICROSERVICE}/get_tenant_favorite_for_building`, { tenant_id, building_id, }, authHeaders()) // { httpsAgent: agent })
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

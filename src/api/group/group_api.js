import axios from 'axios'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'


export const checkIfUserAlreadyPartGroup = (group_id, tenant_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/check_if_user_already_part_of_group`, { group_id, tenant_id }, authHeaders())
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

export const addMeToTheGroup = (user_id, group_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/add_me_to_the_group`, { user_id, group_id }, authHeaders())
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

export const autoGenerateGroup = (user_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${CONTRACTING_MICROSERVICE}/add_me_to_the_group`, { user_id, group_id }, authHeaders())
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
    res({
      group_id: '3098450'
    })
  })
  return p
}


export const userInGroup = (tenant_id, group_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/user_in_group`, { tenant_id, group_id, }, authHeaders())
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

export const createGroup = (tenant_id, corporation_id, building_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/create_group`, { tenant_id, corporation_id, building_id, }, authHeaders())
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

export const getGroupMembers = (group_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_group_members`, { group_id, }, authHeaders())
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

export const getGroupInfo = (group_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_group_info`, { group_id, }, authHeaders())
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

export const saveGroupNameToDb = (group_id, group_name) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/save_group_name`, { group_id, group_name, }, authHeaders())
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

export const getSuiteRankings = (group_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/get_suite_rankings`, { group_id, }, authHeaders())
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

export const saveRankingsToDb = ({ group_id, suite_style_id, suite_alias, ranking, sample_suite_id, cover_photo, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/save_suite_rankings`, { group_id, suite_style_id, suite_alias, ranking, sample_suite_id, cover_photo, }, authHeaders())
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

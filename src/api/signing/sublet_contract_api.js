import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

// get sublet from dynamodb based off facebook post_id
export const getSubletPostById = (post_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_sublet_by_post_id`, { post_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data.data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

// save sublettee form to database
export const saveSubleteeFormToDb = (form) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/save_subletee_form`, form, authHeaders())
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

// save subletor form to database
export const saveSubletorFormToDb = (form) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/save_subletor_form`, form, authHeaders())
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

// get the subletee form from db
export const getSubleteeContractForSubletor = (contract_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_subletee_contract`, { contract_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

// get the subletor form from db
export const getSubletorContractForReview = (contract_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_subletor_contract`, { contract_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

// get the subletee profile
export const getSubleteeProfile = (subletee_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_subletee_profile`, { subletee_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data[0])
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const getContractLink = (contract_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SUBLETTING_MICROSERVICE}/get_contract_link`, { contract_id }, authHeaders())
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

export const convertToRegularSubletObj = (sublet) => {
  return {
    posted_date: sublet.POSTED_DATE,
    post_id: sublet.POST_ID,
    address: sublet.ADDRESS,
    place_id: sublet.PLACE_ID,
    description: sublet.DESCRIPTION,
    price: sublet.PRICE,
    fb_user_id: sublet.FB_USER_ID,
    fb_user_name: sublet.FB_USER_NAME,
    fb_user_pic: sublet.FB_USER_PIC,
    fb_group_id: sublet.FB_GROUP_ID,
    gps_x: sublet.GPS_X,
    gps_y: sublet.GPS_Y,
    ensuite_bath: sublet.ENSUITE_BATH,
    utils_included: sublet.UTILS_INCL,
    female_only: sublet.FEMALE_ONLY,
    rooms_left: sublet.ROOMS_LEFT,
    phone: sublet.PHONE,
    images: sublet.IMAGES ? JSON.parse(sublet.IMAGES) : [],
    scrapped_at: sublet.SCRAPPED_AT,
  }
}

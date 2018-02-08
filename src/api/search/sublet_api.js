import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'
import authHeaders from '../authHeaders'

export const querySubletsInArea = ({ lat, lng, filterParams }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_sublets`, { lat, lng, filterParams }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        const x = data.data.map((sublet) => {
          return convertToRegularSubletObj(sublet)
        }).sort((a, b) => {
          return b.posted_date - a.posted_date
        })
        // console.log(x)
        res(x)
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

export const matchSubletsByPlaceId = ({ place_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_matching_sublets`, { place_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        // console.log(data)
        res(data.data.map((sublet) => {
          return convertToRegularSubletObj(sublet)
        }))
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

export const matchSubletsByAddress = ({ address }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_matching_sublets_by_address`, { address }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        // console.log(data)
        res(data.data.map((sublet) => {
          return convertToRegularSubletObj(sublet)
        }))
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

export const postSubletToDynamoDB = (sublet) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/post_sublet`, { sublet }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        // console.log(data)
        res(data)
      })
      .catch((err) => {
        // console.log(err)
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
        rej(err)
      })
  })
  return p
}

export const grabMySubletsFromDynamoDB = (fb_user_id) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_my_sublets`, { fb_user_id }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        // console.log(data)
        res(data.data.map((sublet) => {
          return convertToRegularSubletObj(sublet)
        }))
      })
      .catch((err) => {
        // console.log(err)
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
        rej(err)
      })
  })
  return p
}

export const bumpMySublet = (sublet) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/bump_sublet`, { sublet }, authHeaders())
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        console.log(data)
        res(data)
      })
      .catch((err) => {
        console.log(err)
        _LTracker.push({
          'error': err,
          'tag' : `${localStorage.getItem('tenant_id')}`
        })
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

export const convertToDynamoDBSubletObj = (sublet) => {
  return {
    POSTED_DATE: sublet.posted_date,
    POST_ID: sublet.post_id,
    ADDRESS: sublet.address,
    PLACE_ID: sublet.place_id,
    DESCRIPTION: sublet.description,
    PRICE: sublet.price,
    FB_USER_ID: sublet.fb_user_id,
    FB_USER_NAME: sublet.fb_user_name,
    FB_USER_PIC: sublet.fb_user_pic,
    FB_GROUP_ID: sublet.fb_group_id,
    GPS_X: sublet.gps_x,
    GPS_Y: sublet.gps_y,
    ENSUITE_BATH: sublet.ensuite_bath,
    UTILS_INCL: sublet.utils_included,
    FEMALE_ONLY: sublet.female_only,
    ROOMS_LEFT: sublet.rooms_left,
    PHONE: sublet.phone,
    IMAGES: JSON.stringify(sublet.images),
    SCRAPPED_AT: sublet.scrapped_at,
  }
}

export const calculateCheapestSublet = (sublets) => {
  let cheapest = sublets[0].price
  sublets.forEach((sublet) => {
    if (!cheapest) {
      cheapest = sublet.price
    }
    if (sublet.price && sublet.price < cheapest) {
      cheapest = sublet.price
    }
  })
  return cheapest
}

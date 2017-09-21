import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'

export const querySubletsInArea = ({ lat, lng, filterParams }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_sublets`, { lat, lng, filterParams })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(data.data.map((sublet) => {
          return convertToRegularSubletObj(sublet)
        }).sort((a, b) => {
          return b.posted_date - a.posted_date
        }))
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

export const matchSubletsByPlaceId = ({ place_id }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_matching_sublets`, { place_id })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        // console.log(data)
        res(data.data.map((sublet) => {
          return convertToRegularSubletObj(sublet)
        }))
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
    images: JSON.parse(sublet.IMAGES) || [],
    scrapped_at: sublet.SCRAPPED_AT,
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

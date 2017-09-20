import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'

export const querySubletsInArea = ({ lat, lng, filterParams }) => {
  console.log({ lat, lng, filterParams })
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_sublets`, { lat, lng, filterParams })
      .then((data) => {
        console.log(data)
        // once we have the response, only then do we dispatch an action to Redux
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

export const getFBPostById = ({ fb_post_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_sublet_by_id`, { fb_post_id })
      .then((data) => {
        // once we have the response, only then do we dispatch an action to Redux
        res(convertToRegularSubletObj(data.data[0]))
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
    place_id: sublet.POSTED_DATE,
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

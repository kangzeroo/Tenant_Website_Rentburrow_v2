import axios from 'axios'
import { SEARCH_MICROSERVICE } from '../API_URLS'

export const getFBPosts = (obj) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_fb_posts`, obj)
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

export const getFBPostById = ({ post_id, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/get_fb_post_by_id`, { post_id })
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

export const sortFBPosts = ({ sort_by }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/sort_fb_posts`, { sort_by })
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

export const filterFBPosts = ({ price, room_count, ensuite_bath, utils_incl, females_only, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${SEARCH_MICROSERVICE}/filter_fb_posts`, { price, room_count, ensuite_bath, utils_incl, females_only, })
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

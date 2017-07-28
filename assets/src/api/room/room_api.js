import axios from 'axios'
import { BUILDING_MICROSERVICE } from '../API_URLS'

export const submitRoomToDB = (room) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/post_room_info`, room)
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

export const getRoomsFromDb = (suite) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/get_room_info`, suite)
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

export const updateRoomThumbnails = ({ room_id, thumbnail, images }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${BUILDING_MICROSERVICE}/update_room_thumbnail_info`, { room_id, thumbnail, images })
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

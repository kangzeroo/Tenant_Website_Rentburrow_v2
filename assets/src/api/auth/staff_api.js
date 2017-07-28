import axios from 'axios'
import { REGISTER_MICROSERVICE } from '../API_URLS'

// save the registration info to server and await for response
export const retrieveStaffFromDatabase = ({ sub, phone, email }) => {
  const p = new Promise((res, rej) => {
    res({
      staff_id: sub,
      staff_name: 'Jake Malliaros',
      staff_thumbnail: 'https://scontent.fyzd1-1.fna.fbcdn.net/v/t1.0-1/p200x200/19247792_10154759424710897_6716293944323829591_n.jpg?oh=52c045d3ab90d12cffe66a6d8f266676&oe=59C9B993',
      staff_phone: '519-345-4543',
      staff_email: email,
    })
    // axios.post(`${REGISTER_MICROSERVICE}/get_staff`, { id: sub })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     console.log(data)
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
  })
  return p
}

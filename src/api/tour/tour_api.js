import axios from 'axios'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'

export const insertTour = ({ inquiry_id, date_1, time_1_begin, time_1_end, date_2, time_2_begin, time_2_end, date_3, time_3_begin, time_3_end, }) => {
  const p = new Promise((res, rej) => {
    axios.post(`${CONTRACTING_MICROSERVICE}/insert_tour`, { inquiry_id, date_1, time_1_begin, time_1_end, date_2, time_2_begin, time_2_end, date_3, time_3_begin, time_3_end, })
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

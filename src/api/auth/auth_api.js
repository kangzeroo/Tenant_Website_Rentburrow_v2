// import { FB } from 'fb'
import axios from 'axios'
import { SUBLETTING_MICROSERVICE } from '../API_URLS'

export const saveStudentProfile = (profile) => {
  const p = new Promise((res, rej) => {
    // search for a specific building from backend
    axios.post(`${SEARCH_MICROSERVICE}/insert_student_profile`, profile)
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

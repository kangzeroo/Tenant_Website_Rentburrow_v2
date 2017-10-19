import { CONTRACTING_MICROSERVICE } from '../API_URLS'


export const checkIfUserAlreadyPartGroup = (group_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${CONTRACTING_MICROSERVICE}/check_if_user_already_part_of_group`, { group_id })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
    res({
      already_joined: false
    })
  })
  return p
}

export const addMeToTheGroup = (user_id, group_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${CONTRACTING_MICROSERVICE}/add_me_to_the_group`, { user_id, group_id })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
    res({
      group_id: '34850485'
    })
  })
  return p
}

export const autoGenerateGroup = (user_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${CONTRACTING_MICROSERVICE}/add_me_to_the_group`, { user_id, group_id })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
    res({
      group_id: '3098450'
    })
  })
  return p
}

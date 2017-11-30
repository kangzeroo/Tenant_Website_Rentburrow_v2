import uuid from 'uuid'
import axios from 'axios'
import { sendSimpleApplicationEmailToRentburrow } from '../messaging/simple_application_email'
import { CONTRACTING_MICROSERVICE } from '../API_URLS'


export const checkWhatLandlordWantsFromTenant = (building_id) => {
  const p = new Promise((res, rej) => {
    // axios.post(`${CONTRACTING_MICROSERVICE}/check_what_landlord_wants_in_application`, { building_id })
    //   .then((data) => {
    //     // once we have the response, only then do we dispatch an action to Redux
    //     res(data.data)
    //   })
    //   .catch((err) => {
    //     rej(err)
    //   })
    res({
      begin: {
        title: 'Begin',
        desc: 'A quick briefing',
        icon: 'sign in',
        key: 'begin',
      },
      group: {
        title: 'Group',
        desc: 'Pick your roommates',
        icon: 'users',
        key: 'roommates',
      },
      suite_room_preferences: {
        title: 'Suite Preferences',
        desc: 'Choose your suite and room',
        icon: 'bed',
        key: 'suite_room_preferences',
      },
      about_tenant: {
        title: 'About Me',
        desc: 'Basic info for lease',
        icon: 'user',
        key: 'about_tenant',
      },
      // about_student: {
      //   title: 'Student Profile',
      //   desc: 'Verification of student status',
      //   icon: 'student',
      //   key: 'about_student',
      // },
      // medical: {
      //   title: 'Medical History',
      //   desc: 'For safety',
      //   icon: 'heartbeat',
      //   key: 'medical_history',
      // },
      // emergancy_contact: {
      //   title: 'Emergancy Contact',
      //   desc: 'In case of emergancies',
      //   icon: 'text telephone',
      //   key: 'emergancy_contact',
      // },
      // personality: {
      //   title: 'Personality',
      //   desc: 'To help assign roommates if applicable',
      //   icon: 'smile',
      //   key: 'personality',
      // },
      // employment: {
      //   title: 'Employment History',
      //   desc: 'For approval of credit worthiness',
      //   icon: 'briefcase',
      //   key: 'employment',
      // },
      // witness: {
      //   title: 'Witness',
      //   desc: 'To be used later',
      //   icon: 'eye',
      //   key: 'witness',
      // },
      // guarantor: {
      //   title: 'Guarantor',
      //   desc: 'In case of missed payment',
      //   icon: 'money',
      //   key: 'guarantor',
      // },
      review: {
        title: 'Submit',
        desc: 'Send to landlord',
        icon: 'send',
        key: 'submit',
      },
    })
  })
  return p
}

export const saveSimpleForm = (group_id, group_members, building, landlord, group_notes) => {
  const p = new Promise((res, rej) => {
    // const group_id = uuid.v4()
    const leaseOjb = {
      group_members: group_members.map((mem) => {
        return {
          ...mem,
            // id: uuid.v4(),
          group_id: group_id,
          building_id: building.building_id,
          building_alias: building.building_alias,
          landlord_id: landlord.corporation_id,
          landlord_alias: landlord.corporation_name,
          group_notes: group_notes,
        }
      })
    }
    sendSimpleApplicationEmailToRentburrow(leaseOjb, building.building_alias, landlord)
    // axios.post(`${CONTRACTING_MICROSERVICE}/save_simple_application`, leaseOjb)
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

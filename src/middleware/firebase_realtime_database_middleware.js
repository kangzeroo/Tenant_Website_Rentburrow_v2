// middleware created for Redux actions that want to go through an open connection

import Rx from 'rxjs'
import firebase from 'firebase'
import { getFirebase } from '../api/firebase/firebase_profile'
import {
  LISTEN_TO_FIREBASE_DB,
  SEND_MESSAGE,
  MARK_AS_READ,
} from '../actions/action_types'
import {
  FIREBASE_VERSION
} from '../api/API_URLS'
import {
  updateChatHistory,
} from '../actions/messaging/messaging_actions'
import { convertToArray } from '../api/general/general_api'


firebase.initializeApp(getFirebase(FIREBASE_VERSION))
const firebase_db = firebase.database()

// this middleware is to establish websocket connections for messaging
// our websocket lives here in rxjs observables
const establishFirebaseRealtimeDatabaseMessaging = (() => {

    // middleware has access to the redux store
    return store => next => action => {

      switch (action.type) {

        case LISTEN_TO_FIREBASE_DB:
          // console.log(action)
          const messages = firebase_db.ref(`tenants/${action.payload}/messages/`)
          messages.on('value', (snapshot) => {
            const array_of_messages = convertToArray(snapshot.val())
            // console.log(array_of_messages)
            if (array_of_messages.length > 0) {
              store.dispatch(updateChatHistory(array_of_messages))
            }
          })
          break;

        case SEND_MESSAGE:
          // console.log('SEND_MESSAGE')
          // console.log(action)
          if (action.payload.receiver_id === 'Rentburrow_Student_Help_Chat') {
            firebase_db.ref(`tenants/${action.payload.receiver_id}/messages/${action.payload.message_id}`).set(action.payload)
            firebase_db.ref(`tenants/${action.payload.sender_id}/messages/${action.payload.message_id}`).set(action.payload)
          } else {
            firebase_db.ref(`tenants/${action.payload.sender_id}/messages/${action.payload.message_id}`).set(action.payload)
            firebase_db.ref(`landlords/${action.payload.receiver_id}/messages/${action.payload.message_id}`).set(action.payload)
          }
          next(action)
          break;

        case MARK_AS_READ:
          action.payload.forEach((msg) => {
            const updatedMsg = {
              ...msg,
              read_at: new Date().getTime(),
            }
            if (msg.sender_id === 'Rentburrow_Student_Help_Chat') {
              firebase_db.ref(`tenants/${updatedMsg.receiver_id}/messages/${updatedMsg.message_id}`).set(updatedMsg)
              firebase_db.ref(`tenants/${updatedMsg.sender_id}/messages/${updatedMsg.message_id}`).set(updatedMsg)
            } else {
              firebase_db.ref(`tenants/${updatedMsg.receiver_id}/messages/${updatedMsg.message_id}`).set(updatedMsg)
              firebase_db.ref(`landlords/${updatedMsg.sender_id}/messages/${updatedMsg.message_id}`).set(updatedMsg)
            }
          })
          break;

        // This action is irrelevant to us, pass it on to the next middleware
        default:
          return next(action);
      }
    }
})()

export default establishFirebaseRealtimeDatabaseMessaging

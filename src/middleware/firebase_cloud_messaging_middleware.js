// middleware created for Redux actions that want to go through an open connection

import Rx from 'rxjs'
import firebase from 'firebase'
import { getFirebase } from '../api/firebase/firebase_profile'
import {
  REQUEST_NOTIFICATIONS_PERMISSION,
  SEND_MESSAGE,
  ADD_MESSAGE,
} from '../actions/action_types'
import {
  FIREBASE_VERSION
} from '../api/API_URLS'
import {
  setFCMToken,
  addChatHistory,
} from '../actions/messaging/messaging_actions'


firebase.initializeApp(getFirebase(FIREBASE_VERSION))
const messaging = firebase.messaging()

// this middleware is to establish websocket connections for messaging
// our websocket lives here in rxjs observables
const establishFirebaseMessaging = (() => {

    // middleware has access to the redux store
    return store => next => action => {

      switch (action.type) {

        // display the notifications permission
        case REQUEST_NOTIFICATIONS_PERMISSION:
          // first request permission to display desktop notifications
          messaging.requestPermission()
            .then(() => {
              // console.log('Got permission!')
              // then get a FCM token
              return messaging.getToken()
            })
            .then((token) => {
              // console.log(token)
              store.dispatch(setFCMToken(token))
              next(action)
            })
            .catch((err) => {
              // console.log(err)
              _LTracker.push({
                'error': err,
                'tag' : `${localStorage.getItem('tenant_id')}`
              })
              next(action)
            })
          // listen for any token refreshes and save them as most updated version
          messaging.onTokenRefresh(() => {
            messaging.getToken()
              .then((refreshedToken) => {
                // console.log('Token refreshed: ', refreshedToken)
                store.dispatch(setFCMToken(refreshedToken))
              })
              .catch((err) => {
                _LTracker.push({
                  'error': err,
                  'tag' : `${localStorage.getItem('tenant_id')}`
                })
                // console.log('Unable to retrieve refreshed token ', err)
              })
          })
          // on receiving a message, dispatch a redux action
          messaging.onMessage((payload) => {
            // console.log('Message received. ', payload)
            store.dispatch(addChatHistory([payload]))
          })
          break;

        case ADD_MESSAGE:
          // console.log(action)
          next(action)
          break;

        case SEND_MESSAGE:
          // console.log('SEND_MESSAGE')

          next(action)
          break;

        // This action is irrelevant to us, pass it on to the next middleware
        default:
          return next(action);
      }
    }
})()

export default establishFirebaseMessaging

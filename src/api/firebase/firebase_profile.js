

export const getFirebase = (env) => {
  if (env === 'production') {
    return {
      apiKey: 'AIzaSyAmNxBUkGJ5cUBLgI9kFVaPItoSyqqMMYE',
      authDomain: 'rentburrow-messaging.firebaseapp.com',
      databaseURL: 'https://rentburrow-messaging.firebaseio.com',
      projectId: 'rentburrow-messaging',
      storageBucket: 'rentburrow-messaging.appspot.com',
      messagingSenderId: '49791011221'
    }
  } else {
    return {
      apiKey: 'AIzaSyAmNxBUkGJ5cUBLgI9kFVaPItoSyqqMMYE',
      authDomain: 'rentburrow-messaging.firebaseapp.com',
      databaseURL: 'https://rentburrow-messaging.firebaseio.com',
      projectId: 'rentburrow-messaging',
      storageBucket: 'rentburrow-messaging.appspot.com',
      messagingSenderId: '49791011221'
    }
  }
}

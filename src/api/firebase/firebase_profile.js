

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
      apiKey: "AIzaSyDKdW_VZW_YOtGBGVNuc7jMqA0EjRyE-Fc",
      authDomain: "rentburrow-messaging-dev.firebaseapp.com",
      databaseURL: "https://rentburrow-messaging-dev.firebaseio.com",
      projectId: "rentburrow-messaging-dev",
      storageBucket: "rentburrow-messaging-dev.appspot.com",
      messagingSenderId: "1062757904896"
    }
  }
}

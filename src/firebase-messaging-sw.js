// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

console.log('Successfully initialized service worker!')

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: 'AIzaSyDiHR9xODoEvnm5vyaUeTjwj2K6kJXJOxs',
  authDomain: 'rentburrow-landlord.firebaseapp.com',
  databaseURL: 'https://rentburrow-landlord.firebaseio.com',
  projectId: 'rentburrow-landlord',
  storageBucket: '',
  messagingSenderId: '639431353717'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  // only for fcm messages that use 'data' instead of 'notification'
  console.log(payload)
  const title = 'hello world'
  const options = {
    body: payload.data.status,
    icon: '/assets/images/logo.png'
  }
  return self.registration.showNotification(title, options)
})

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a sevice worker
//   `messaging.setBackgroundMessageHandler` handler.



// Test it out

// data only
// curl -X POST --header "Authorization: key=AAAAlOEUJXU:APA91bE2gV8hmip-Ne8HhcRbeCTp5OLWl3c7VvX7xgsVkYfSEIJp2alURJsR4eoEClP5w4xGkCwARJSs3l-UQngloK0VpNbBtsDskUS-UvCR47sbO4JsVNqIXUk8VYgVLd2gDoS_gV5g" --Header "Content-Type: application/json" -d '{"to":"c_zn1VWLCNc:APA91bHQYm4g8DJgvKrW4ZFw38MBeW9LqM19R7Yhf4Xdo6h3BztzckxRwqOCcJOV4YzN4P2ZaCT_LNto83pRZpIfS4HpEcfcJAZApVuIw6zJWWJmEGrkG1LipIKjZi6PrxysSiMUuFxS","priority":10, "data": {"title": "Kangze on Sage 5", "body": "Do you have any rooms of 2 left?", "click_action" : "https://google.com", "icon": "https://d30y9cdsu7xlg0.cloudfront.net/png/23179-200.png"}}' https://fcm.googleapis.com/fcm/send

// notification only
// curl -X POST --header "Authorization: key=AAAAlOEUJXU:APA91bE2gV8hmip-Ne8HhcRbeCTp5OLWl3c7VvX7xgsVkYfSEIJp2alURJsR4eoEClP5w4xGkCwARJSs3l-UQngloK0VpNbBtsDskUS-UvCR47sbO4JsVNqIXUk8VYgVLd2gDoS_gV5g" --Header "Content-Type: application/json" -d '{"to":"corF_emTPLE:APA91bFbXO-bucyW5YfCOPVEmaCd4jHfvVSG6gn1ZagVY8gasKcbXvOQ3JLA-QyGCmCQB-KoF1he3E2CTipGJU-QQRDh3MpaPpxT5yj8e3Baq9UgnGjHwu53ryqzM11UZYadGvHDHAAE","priority":10, "notification": {"title": "Kangze on Sage 5", "body": "Do you have any rooms of 2 left?", "click_action" : "https://google.com", "icon": "https://d30y9cdsu7xlg0.cloudfront.net/png/23179-200.png"}}' https://fcm.googleapis.com/fcm/send

// notification with data
// curl -X POST --header "Authorization: key=AAAAlOEUJXU:APA91bE2gV8hmip-Ne8HhcRbeCTp5OLWl3c7VvX7xgsVkYfSEIJp2alURJsR4eoEClP5w4xGkCwARJSs3l-UQngloK0VpNbBtsDskUS-UvCR47sbO4JsVNqIXUk8VYgVLd2gDoS_gV5g" --Header "Content-Type: application/json" -d '{"to" : "APA91bHun4MxP5egoKMwt2KZFBaFUH-1RYqx...", "notification" : {"body" : "great match!","title" : "Portugal vs. Denmark","icon" : "myicon"},"data" : {"Nick" : "Mario","Room" : "PortugalVSDenmark"}}' https://fcm.googleapis.com/fcm/send

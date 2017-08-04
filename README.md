# Rentburrow Tenant
The public facing website for tenants. Use it to browse properties, apply for leases and view your favorites.
<br/><br/>
Includes the following technologies:
- NodeJS v6.3.1 LTS
- ExpressJS with HTTPS
- ReactJS v15
- RxJS
- Webpack 2
- Websockets via Socket.io
- Dockerized


## Setup
// $ npm install <br/>
// To use in dev, $ npm run start <br/>
// To use in prod, $ npm run build; $ npm run prod <br/>

## Run with firebase cloud messaging
// $ npm run node <br/>
// $ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:8080
<br />
### The reason why this is needed is because firebase cloud messaging (fcm) is only available on https with service workers
### service workers require SSL certificates (official or self-signed)
### since we are using a self-signed certificate, we must start google chrome in an insecure state
### we also need a service-worker.js file to be running firebase in the background when we are not on the website. this would be a seperate file that has its own version of firebase running (./src/firebase-messaging-sw.js)
### so thus we will have 2 running instances of firebase going on. one within our app for notifications while we inside the webpage, and one when we are not in the webpage
<br />
Test out the messaging with this cURL command:
<br />
curl -X POST --header "Authorization: key=<SERVER_KEY>" --Header "Content-Type: application/json" -d '{"to":"<FIREBASE_TOKEN>","priority":10, "data": {"title": "Background Message Title", "body": "Background message body", "click_action" : "https://dummypage.com", "icon": "https://d30y9cdsu7xlg0.cloudfront.net/png/23179-200.png"}}' https://fcm.googleapis.com/fcm/send

### Be sure to also:
// Copy manifest.json to dist/
// Copy server.crt and server.key to credentials/ for https

### Build and run docker images with:
$ bash build.sh<br/>
$ bash run.sh<br/>

### Check docker images and containers with:
$ docker images<br/>
$ docker ps<br/>

### remove docker images and containers with:
$ docker rm <CONTAINER_ID><br/>
$ docker rmi <IMAGE_ID><br/>

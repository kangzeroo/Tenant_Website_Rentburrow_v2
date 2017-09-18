const express = require('express')
const path = require('path')
const https = require('https')
const http = require('http')
const fs = require('fs')
const router = require('./router')

const app = express()

// serve static assets normally
app.use(
  express.static(path.resolve(__dirname, '/dist'))
)

router(app);

const options = {
    key: fs.readFileSync('./credentials/server.key'),
    cert: fs.readFileSync('./credentials/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
}

// Server setup
// if there is an environment variable of PORT already defined, use it. otherwise use port 3091
const port = process.env.PORT || 8081

if (process.env.NODE_ENV === 'production') {
  const server = http.createServer(app)
  // listen to the server on port
  server.listen(port, () => {
    console.log('Server listening on http: ', port)
  })
} else {
  // create a server with the native node https library
  const server = https.createServer(options, app)
  // listen to the server on port
  server.listen(port, () => {
    console.log('Server listening on https: ', port)
  })
}

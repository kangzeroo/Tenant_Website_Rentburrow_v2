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

// Server setup
// if there is an environment variable of PORT already defined, use it. otherwise use port 3091
const port = process.env.PORT || 8081

if (process.env.NODE_ENV === 'production') {
  const options = {
      ca: fs.readFileSync('./credentials/rentburrow_com.ca-bundle'),
      key: fs.readFileSync('./credentials/rentburrow_com.key'),
      cert: fs.readFileSync('./credentials/rentburrow_com.crt'),
      requestCert: false,
      rejectUnauthorized: false
  }
  // create a server with the native node https library
  const server = https.createServer(options, app)

  // listen to the server on port
  server.listen(port, () => {
    console.log('Server listening on https: ', port)
  })
} else {
  const options = {
      key: fs.readFileSync('./credentials/server.key'),
      cert: fs.readFileSync('./credentials/server.crt'),
      requestCert: false,
      rejectUnauthorized: false
  }
  // create a server with the native node https library
  const server = https.createServer(options, app)
  // listen to the server on port
  server.listen(port, () => {
    console.log('Server listening on https: ', port)
  })
}

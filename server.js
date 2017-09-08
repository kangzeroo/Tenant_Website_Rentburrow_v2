const express = require('express')
const path = require('path')
const https = require('https')
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

// create a server with the native node https library
const server = https.createServer(options, app)

// listen to the server on port
server.listen(port, () => {
  console.log('Server listening on: ', port)
})

const path = require('path')

// routes
// bodyParser attempts to parse any request into JSON format
// bodyParser attempts to parse any request into GraphQL format
// const graphql_encoding = bodyParser.text({ type: 'application/graphql' })

module.exports = function(app){

  // viewed at https://localhost:8080
  app.get('/bundle.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './dist/bundle.js'))
  })
  app.get('/firebase-messaging-sw.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './src/firebase-messaging-sw.js'))
  })
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'))
  })
}

var express = require('express')
var pathname = require('pathname-match')

module.exports = function (app, logger) {
  var port = process.env.PORT || 3007
  var server = express()

  app.keep('logger', logger)

  server.use((req, res) => {
    app.clean()

    app.set('json', createJsonMethod(res))
    app.set('view', createViewMethod(res))

    app.state.method = req.method
    app.state.pathname = pathname(req.url)
    app.state.url = req.url

    app.match(app.state.pathname)
  })

  server.listen(port, (err) => {
    if (err) throw err
    else logger.info('Listening at localhost:' + port)
  })
}

function createJsonMethod (res) {
  return function (json, status) {
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(status || 200)
    res.end(JSON.stringify(json, null, 2))
  }
}

function createViewMethod (res) {
  return function (body, status) {
    res.setHeader('Content-Type', 'text/html')
    res.writeHead(status || 200)
    res.end(`
      <!doctype html>
      <html>
        <head>
          <title>Abstract Router</title>
        </head>
        ${body}
      </html>
    `)
  }
}

function createLogger () {
  return {
    error: console.error,
    info: console.info,
    warn: console.warn
  }
}

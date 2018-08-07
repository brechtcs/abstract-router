var express = require('express')

module.exports = function (app) {
  var port = process.env.PORT || 3007
  var logger = createLogger()
  var server = express()

  server.use((req, res) => {
    app.clean()

    app.prop('json', createJsonMethod(res))
    app.prop('view', createViewMethod(res))
    app.prop('logger', logger)

    app.state.url = req.url
    app.state.method = req.method

    app.match(req.url)
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

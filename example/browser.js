var history = require('nanohistory')
var href = require('nanohref')
var html = require('nanohtml')
var morph = require('nanomorph')
var pathname = require('pathname-match')

module.exports = function (app, logger) {
  app.keep('logger', logger)
  app.keep('json', jsonMethod)
  app.keep('view', viewMethod)

  function render (location) {
    app.clean()

    app.state.method = 'GET'
    app.state.pathname = pathname(location.href)
    app.state.url = location.href

    app.match(app.state.pathname)
  }

  pageify(render)
}

function jsonMethod (json) {
  viewMethod(html`<body>
    <pre>${JSON.stringify(json, null, 2)}</pre>
  </body>`)
}

function viewMethod (body) {
  morph(document.body, body)
}

function pageify (handler) {
  var EMPTY_OBJ = {}
  history(handler)
  href(location => {
    window.history.pushState(EMPTY_OBJ, null, location.href)
    handler(location)
  })
  handler(window.location)
}

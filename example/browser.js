var history = require('nanohistory')
var href = require('nanohref')
var html = require('nanohtml')
var morph = require('nanomorph')

module.exports = function (app) {
  function render (location) {
    app.clean()

    app.prop('json', jsonMethod)
    app.prop('view', viewMethod)
    app.prop('logger', {
      error: console.error,
      info: console.info,
      warn: console.warn
    })

    location = location || window.location
    app.state.url = location.href
    app.state.method = 'GET'

    app.match(location.href)
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
  var OBJ = {}
  history(handler)
  href(location => {
    window.history.pushState(OBJ, null, location.href)
    handler(location)
  })
  handler()
}

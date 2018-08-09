var html = require('nanohtml')
var morph = require('nanomorph')
var pathname = require('pathname-match')
var spa = require('../spa')

module.exports = function (app, logger) {
  app.keep('logger', logger)
  app.keep('json', jsonMethod)
  app.keep('view', viewMethod)

  function render (target) {
    app.clean()

    app.state.method = (target.method || 'GET').toUpperCase()
    app.state.url = target.href || target.action
    app.state.pathname = pathname(app.state.url)

    app.match(app.state.pathname)
  }

  spa(render)
}

function jsonMethod (json) {
  viewMethod(html`<body>
    <pre>${JSON.stringify(json, null, 2)}</pre>
  </body>`)
}

function viewMethod (body) {
  morph(document.body, body)
}

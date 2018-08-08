var AbstractRouter = require('../')
var html = require('nanohtml')
var runtime = require('is-browser') ? require('./browser') : require('./server')

var router = AbstractRouter.create({
  cleanState: {title: 'Abstract Router'}
})

router.on('/', function (state, app) {
  app.logger.info(state.method, state.url)
  app.view(html`<body>
    <ul>
      <li><a href="/first">first</a></li>
      <li><a href="/second">second</a></li>
      <li><a href="/third">third</a></li>
    </ul>
  </body>`)
})

router.on('/:route', function (state, app) {
  app.logger.info(state.method, state.url)
  app.json(state)
})

router.impl(runtime, {
  error: console.error,
  info: console.info,
  warn: console.warn
})

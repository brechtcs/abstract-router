var AbstractRouter = require('../')
var html = require('nanohtml')

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
    <form action="/first" method="POST">
      <input type="hidden" value="yep">
      <input type="submit" value="post!">
    </form>
  </body>`)
})

router.on('/:route', function (state, app) {
  app.logger.info(state.method, state.url)
  app.json(state)
})

module.exports = router

var AbstractRouter = require('../')
var server = require('./server')

var router = AbstractRouter.create({
  cleanState: {title: 'Abstract Router'}
})

router.route('/', function (state, app) {
    app.logger.info(state.method, state.url)
    app.view('Server active.')
})

router.route('/:url', function (state, app) {
    app.logger.info(state.method, state.url)
    app.json(state)
})

router.init(server)

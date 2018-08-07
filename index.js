var assert = require('assert')
var pathname = require('pathname-match')
var router = require('wayfarer')

class AbstractRouter {
  static create (dft, opts) {
    if (!opts) {
      if (typeof dft === 'string') {
        opts = {}
      } else {
        opts = dft
        dft = null
      }
    }
    return new AbstractRouter(dft, opts)
  }

  constructor (dft, opts) {
    this.app = new AppContext(opts.cleanState)
    this.router = router(dft)
    this.opts = opts
  }

  clean () {
    this.app = new AppContext(this.opts.cleanState)
  }

  init (fn) {
    fn(this)
  }

  match (route) {
    this.router(pathname(route))
  }

  prop (name, prop) {
    this.app.prop(name, prop)
  }

  route (route, handler) {
    this.router.on(route, params => {
      this.state.params = params
      handler(this.app.state, this.app.ctx)
    })
  }

  get state () {
    return this.app.state
  }

  set state (_) {
    throw new Error('Cannot overwrite app state')
  }
}

class AppContext {
  constructor (state) {
    this.ctx = {}
    this.state = state || {}
  }

  prop (name, prop) {
    assert(!this.ctx[name], 'Cannot overwrite app property: ' + name)
    this.ctx[name] = prop
  }
}

module.exports = AbstractRouter

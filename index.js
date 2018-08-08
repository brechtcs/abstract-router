var assert = require('assert')
var router = require('wayfarer')

class AbstractRouter {
  static create (dft, opts) {
    if (!opts) {
      if (!dft || typeof dft === 'string') {
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
    this.opts = opts
    this.props = {}
    this.router = router(dft)
  }

  clean () {
    this.app = new AppContext(this.opts.cleanState)
    Object.keys(this.props).forEach(name => {
      this.app.prop(name, this.props[name])
    })
  }

  impl (fn, ...args) {
    fn(this, ...args)
  }

  keep (name, prop) {
    this.app.prop(name, prop)
    this.props[name] = prop
  }

  on (route, handler) {
    this.router.on(route, params => {
      this.state.params = params
      handler(this.app.state, this.app.props)
    })
  }

  match (url) {
    this.router(url)
  }

  set (name, prop) {
    this.app.prop(name, prop)
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
    this.props = {}
    this.state = state || {}
  }

  prop (name, prop) {
    assert(!this.props[name], 'Cannot overwrite app property: ' + name)
    this.props[name] = prop
  }
}

module.exports = AbstractRouter

var assert = require('nanoassert')
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
    this.keepers = []
    this.opts = opts
    this.router = router(dft)
  }

  clean () {
    this.app = new AppContext(this.opts.cleanState)
    this.keepers.forEach(name => {
      this.app.prop(name, this[name])
    })
  }

  impl (fn, ...args) {
    fn(this, ...args)
  }

  keep (name, prop) {
    assert(!this[name], 'Cannot overwrite property: ' + name)
    this[name] = prop
    this.app.prop(name, prop)
    this.keepers.push(name)
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
    assert(!this.props[name], 'Cannot overwrite property: ' + name)
    this.props[name] = prop
  }
}

module.exports = AbstractRouter

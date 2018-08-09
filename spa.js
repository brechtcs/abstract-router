var href = require('nanohref')

module.exports = function (render) {
  var EMPTY_OBJ = {}

  href(location => {
    window.history.pushState(EMPTY_OBJ, null, location.href)
    render(location)
  })

  window.addEventListener('submit', function (event) {
    event.preventDefault()

    window.history.pushState(EMPTY_OBJ, null, event.target.action)
    render(event.target)
  })

  window.addEventListener('popstate', function () {
    render(document.location)
  })

  render(window.location)
}

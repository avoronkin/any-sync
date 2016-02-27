var _ = require('lodash')

module.exports = {
  keyIterator: function (collection) {
    var i = -1
    var keys = _.keys(collection)
    var length = keys.length

    return function next () {
      i++
      return i < length ? keys[i] : null
    }
  }
}

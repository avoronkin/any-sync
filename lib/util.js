var _ = require('lodash')
var wrap = require('wrapped')

module.exports = {
  keyIterator: function (collection) {
    var i = -1
    var keys = _.keys(collection)
    var length = keys.length

    return function next () {
      i++
      return i < length ? keys[i] : null
    }
  },
  withoutIndex: function (iterator) {
    return function (value, index, callback) {
      return wrap(iterator)(value, callback)
    }
  }
}

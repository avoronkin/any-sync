var wrap = require('wrapped')
var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function eachOf (collection, iterator, callback) {
  var promise = new Promise(function (resolve, reject) {
    var completed = 0

    _.each(collection, function (value, key) {
      completed++
      wrap(iterator)(value, key, done)
    })

    function done (err) {
      completed--
      if (err) {
        reject(err)
      } else if (completed <= 0) {
        resolve()
      }
    }
  })

  return promise.asCallback(callback)
}

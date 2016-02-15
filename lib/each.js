var wrap = require('wrapped')
var Promise = require('bluebird')
var _ = require('lodash')

module.exports = function each (collection, iterator, callback) {
  var promise = new Promise(function (resolve, reject) {
    var completed = 0

    _.each(collection, function (item) {
      completed++
      wrap(iterator)(item, done)
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

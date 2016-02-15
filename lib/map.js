var wrap = require('wrapped')
var Promise = require('bluebird')

module.exports = function each (arr, iterator, callback) {
  var promise = new Promise(function (resolve, reject) {
    var completed = 0
    var results = []

    arr.forEach(function (item, index) {
      completed++
      wrap(iterator)(item, function done (err, item) {
        completed--
        results[index] = item
        if (err) {
          reject(err)
        } else if (completed <= 0) {
          resolve(results)
        }
      })
    })
  })

  return promise.asCallback(callback)
}

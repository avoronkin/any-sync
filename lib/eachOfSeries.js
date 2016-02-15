var wrap = require('wrapped')
var Promise = require('bluebird')

module.exports = function eachSeries (arr, iterator, callback) {
  var promise = new Promise(function (resolve, reject) {
    var len = arr.length
    var index = 0

    function iterate () {
      if (index === len) {
        return resolve()
      }

      wrap(iterator)(arr[index], function done (err) {
        if (err) {
          return reject(err)
        }
        index++
        iterate()
      })
    }
    iterate()
  })

  return promise.asCallback(callback)
}

var wrap = require('wrapped')
var Promise = require('bluebird')
var keyIterator = require('./util').keyIterator

module.exports = function eachSeries (collection, iterator, callback) {
  var promise = new Promise(function (resolve, reject) {
    var nextKey = keyIterator(collection)
    var key = nextKey()

    function iterate () {
      if (key === null) {
        return resolve()
      }

      wrap(iterator)(collection[key], key, done)

      function done (err) {
        if (err) {
          return reject(err)
        }
        key = nextKey()
        iterate()
      }
    }

    iterate()
  })

  return promise.asCallback(callback)
}

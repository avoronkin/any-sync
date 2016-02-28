var wrap = require('wrapped')
var eachOfSeries = require('./eachOfSeries')
var Promise = require('bluebird')

module.exports = function reduce (collection, accumulator, iterator, callback) {
  var promise = new Promise(function (resolve, reject) {
    eachOfSeries(collection, function (value, key, cb) {
      wrap(iterator)(accumulator, value, done)

      function done (err, result) {
        accumulator = result
        cb(err)
      }
    }).then(function () {
      resolve(accumulator)
    }, reject)
  })

  return promise.asCallback(callback)
}

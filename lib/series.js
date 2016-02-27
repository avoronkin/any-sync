var wrap = require('wrapped')
var _ = require('lodash')
var Promise = require('bluebird')
var keyIterator = require('./util').keyIterator

module.exports = function (tasks, callback) {
  var promise = new Promise(function (resolve, reject) {
    var results = _.isArray(tasks) ? [] : {}
    var nextKey = keyIterator(tasks)
    var key = nextKey()

    function iterate () {
      if (key === null) {
        return resolve(results)
      }

      var done = _.rest(function (err, args) {
        if (err) {
          return reject(err)
        } else {
          args = args.length <= 1 ? args[0] : args
          results[key] = args

          key = nextKey()
          iterate()
        }
      })

      wrap(tasks[key])(done)
    }

    iterate()
  })

  return promise.asCallback(callback)
}

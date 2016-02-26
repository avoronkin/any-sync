var wrap = require('wrapped')
var _ = require('lodash')
var Promise = require('bluebird')

module.exports = function (tasks, callback) {
  var promise = new Promise(function (resolve, reject) {
    var results = _.isArray(tasks) ? [] : {}
    var completed = 0

    _.each(tasks, function (task, key) {
      completed++

      var done = _.rest(function (err, args) {
        completed--
        args = args.length <= 1 ? args[0] : args
        results[key] = args

        if (err) {
          reject(err)
        } else if (completed <= 0) {
          resolve(results)
        }
      })

      wrap(task)(done)
    })
  })

  return promise.asCallback(callback)
}

var wrap = require('wrapped')
var _ = require('lodash')
var Promise = require('bluebird')
var keyIterator = require('./util').keyIterator

module.exports = function (tasks, callback) {
  var promise = new Promise(function (resolve, reject) {
    var nextKey = keyIterator(tasks)
    var key = nextKey()

    function iterate (args) {
      args = args || []
      if (key === null) {
        args = args.length <= 1 ? args[0] : args
        return resolve(args)
      }

      var done = _.rest(function (err, args) {
        if (err) {
          return reject(err)
        } else {
          key = nextKey()
          iterate(args)
        }
      })

      args.push(done)
      wrap(tasks[key]).apply(null, args)
    }
    iterate()
  })

  return promise.asCallback(callback)
}

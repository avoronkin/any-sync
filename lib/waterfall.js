var wrap = require('wrapped')
var _ = require('lodash')
var Promise = require('bluebird')

function _keyIterator (coll) {
  var i = -1
  var len
  var keys
  if (_.isArray(coll)) {
    len = coll.length
    return function next () {
      i++
      return i < len ? i : null
    }
  } else {
    keys = _.keys(coll)
    len = keys.length
    return function next () {
      i++
      return i < len ? keys[i] : null
    }
  }
}

module.exports = function (tasks, callback) {
  var promise = new Promise(function (resolve, reject) {
    var results = _.isArray(tasks) ? [] : {}
    var nextKey = _keyIterator(tasks)
    var key = nextKey()

    function iterate (args) {
      args = args || []
      if (key === null) {
        args = args.length <= 1 ? args[0] : args
        return resolve(args)
      }

      var next = _.rest(function (err, args) {
        if (err) {
          return reject(err)
        } else {
          key = nextKey()
          iterate(args)
        }
      })
      args.push(next)
      wrap(tasks[key]).apply(null, args)
    }
    iterate()
  })

  return promise.asCallback(callback)
}

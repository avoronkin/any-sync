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

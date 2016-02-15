var wrap = require('wrapped')
var Q = require('q')

exports.processArrayOrObject = function processArrayOrObject (tasks, handlerFn, callback) {
  var tasksArray
  var isArray = Array.isArray(tasks)
  var res
  var keys
  var deferred = Q.defer()

  if (isArray) {
    tasksArray = tasks
  } else {
    keys = Object.keys(tasks)
    tasksArray = keys.map(function (key) {
      return tasks[key]
    })
  }

  function cb (err, results) {
    if (err) {
      deferred.reject(err)
    }

    if (isArray) {
      res = results
    } else {
      res = {}
      keys.forEach(function (key, i) {
        res[key] = results[i]
      })
    }

    deferred.resolve(res)
  }

  wrap(handlerFn)(tasksArray, cb)

  deferred.promise.nodeify(callback)
  return deferred.promise
}

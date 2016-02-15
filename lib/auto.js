var wrap = require('wrapped')
var _ = require('lodash')
var Promise = require('bluebird')

module.exports = function (tasks, concurrency, callback) {
  if (typeof arguments[1] === 'function') {
    // concurrency is optional, shift the args.
    callback = concurrency
    concurrency = null
  }

  var keys = _.keys(tasks)
  var remainingTasks = keys.length
  if (!remainingTasks) {
    return callback(null)
  }
  if (!concurrency) {
    concurrency = remainingTasks
  }
  var results = {}
  var runningTasks = 0

  var hasError = false

  var listeners = []

  function addListener (fn) {
    listeners.unshift(fn)
  }

  function removeListener (fn) {
    var idx = _.indexOf(listeners, fn)
    if (idx >= 0) listeners.splice(idx, 1)
  }

  function taskComplete () {
    remainingTasks--
    _.each(listeners.slice(0), function (fn) {
      fn()
    })
  }

  var promise = new Promise(function (resolve, reject) {
    addListener(function () {
      if (!remainingTasks) {
        resolve(results)
      }
    })

    _.each(keys, function (key) {
      if (hasError) return
      var task = _.isArray(tasks[key]) ? tasks[key] : [tasks[key]]

      var taskCallback = _.rest(function (err, args) {
        runningTasks--
        args = args.length <= 1 ? args[0] : args

        if (err) {
          // var safeResults = {}
          // _.each(results, function(val, rkey) {
          // safeResults[rkey] = val
          // })
          // safeResults[key] = args
          hasError = true

          // console.log('err', err, safeResults)
          reject(err)
        // callback(err, safeResults)
        } else {
          results[key] = args
          taskComplete()
        }
      })

      var requires = task.slice(0, task.length - 1)
      // prevent dead-locks
      var len = requires.length
      var dep
      while (len--) {
        if (!(dep = tasks[requires[len]])) {
          throw (new Error('Has nonexistent dependency in ' + requires.join(', ')))
        }
        if (_.isArray(dep) && _.indexOf(dep, key) >= 0) {
          throw (new Error('Has cyclic dependencies'))
        }
      }
      function ready () {
        return runningTasks < concurrency && _.reduce(requires, function (a, x) {
          return (a && results.hasOwnProperty(x))
        }, true) && !results.hasOwnProperty(key)
      }

      if (ready()) {
        runningTasks++
        wrap(task[task.length - 1])(results, taskCallback)
      } else {
        addListener(listener)
      }

      function listener () {
        if (ready()) {
          runningTasks++
          removeListener(listener)
          wrap(task[task.length - 1])(results, taskCallback)
        }
      }
    })
  })

  return promise.asCallback(callback)
}

var wrap = require('wrapped')
var _ = require('lodash')
var Promise = require('bluebird')

module.exports = function (tasks, concurrency, callback) {
  var keys = _.keys(tasks)
  var remainingTasks = keys.length
  var results = {}
  var runningTasks = 0
  var hasError = false
  var listeners = []

  if (typeof arguments[1] === 'function') {
    // concurrency is optional, shift the args.
    callback = concurrency
    concurrency = null
  }

  if (!remainingTasks) {
    return callback(null)
  }

  if (!concurrency) {
    concurrency = remainingTasks
  }

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
      var requires = task.slice(0, task.length - 1)
      // prevent dead-locks
      var len = requires.length
      var deps
      while (len--) {
        deps = tasks[requires[len]]
        if (!deps) {
          hasError = true
          return reject(new Error('auto: has nonexistent dependency in ' + requires.join(', ')))
        }
        if (_.isArray(deps) && _.indexOf(deps, key) >= 0) {
          hasError = true
          return reject(new Error('auto: has cyclic dependencies'))
        }
      }

      var taskCallback = _.rest(function (err, args) {
        runningTasks--
        args = args.length <= 1 ? args[0] : args

        if (err) {
          hasError = true
          reject(err)
        } else {
          results[key] = args
          taskComplete()
        }
      })

      if (ready()) {
        runningTasks++
        wrap(task[task.length - 1])(results, taskCallback)
      } else {
        addListener(listener)
      }

      function ready () {
        return runningTasks < concurrency && _.reduce(requires, function (a, x) {
          return (a && results.hasOwnProperty(x))
        }, true) && !results.hasOwnProperty(key)
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

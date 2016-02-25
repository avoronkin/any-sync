var assert = require('assert')
var helpers = require('./helpers')
var auto = require('../lib/auto')

describe('auto', function () {
  it('should work', function () {
    return auto({
      one: function () {
        return 1
      },
      two: ['one', function (results) {
        return results.one + 2
      }],
      three: ['two', function (results, cb) {
        helpers.rasync(results.two + 3, cb)
      }]
    }, function (err, results) {
      assert.ifError(err)
      assert.deepEqual(results, {one: 1, two: 3, three: 6})
    })
  })

  it('empty object', function (done) {
    auto({}, function (err) {
      assert.ok(err === null, err + " passed instead of 'null'")
      done()
    })
  })

  it('error', function () {
    auto({
      task1: function (results, callback) {
        callback('testerror')
      },
      task2: ['task1', function (results, callback) {
        throw new Error('task2 should not be called')
        callback()
      }],
      task3: function (results, callback) {
        callback('testerror2')
      }
    },
      function (err) {
        assert.equal(err, 'testerror')
      })
  })

  it('no callback', function (done) {
    auto({
      task1: function (results, callback) {callback();},
      task2: ['task1', function (results, callback) {callback(); done();}]
    })
  })

  it('concurrency no callback', function (done) {
    auto({
      task1: function (results, callback) {callback();},
      task2: ['task1', function (results, callback) {callback(); done();}]
    }, 1)
  })

  it('should  prevent dead-locks due to inexistant dependencies', function () {
    return auto({
      task1: ['nonexist', function (results, cb) {
        cb(null, 'task1')
      }],
    })
      .then(null, function (err) {
        assert(err)
      })
  })

  it('should prevent dead-locks due to cyclic dependencies', function () {
    auto({
      task1: ['task2', function (results, callback) {
        callback(null, 'task1')
      }],
      task2: ['task1', function (results, callback) {
        callback(null, 'task2')
      }]
    })
      .then(null, function (err) {
        assert(err)
      })
  })

  it('should stops running tasks on error', function (done) {
    auto({
      task1: function (results, callback) {
        callback('error')
      },
      task2: function (results, callback) {
        throw new Error('test2 should not be called')
        callback()
      }
    }, 1, function (err) {
      assert.equal(err, 'error')
      done()
    })
  })
})

var parallel = require('../lib/parallel')
var assert = require('assert')
var helpers = require('./helpers')

describe('parallel', function () {
  it('should support node style callback', function (done) {
    parallel([
      function (cb) {
        helpers.rasync(1, cb)
      }
    ], done)
  })

  it('should pass error in node style callback', function (done) {
    parallel([
      function (cb) {
        cb(new Error())
      }
    ], function (err, results) {
      assert(err)
      done()
    })
  })

  it('should pass throwed error in node style callback', function (done) {
    parallel([
      function (cb) {
        throw new Error()
      }
    ], function (err, results) {
      assert(err)
      done()
    })
  })

  it('should return promise', function (done) {
    parallel([
      function (cb) {
        helpers.rasync(1, cb)
      }
    ]).then(done.bind(null, null), done)
  })

  it('should pass error in promise', function () {
    return parallel([
      function (cb) {
        cb(new Error())
      }
    ]).then(null, function (err) {
      assert(err)
    })
  })

  it('should pass throwed error in promise', function () {
    return parallel([
      function (cb) {
        throw new Error()
      }
    ]).then(null, function (err) {
      assert(err)
    })
  })

  it('should acsept object with tasks', function () {
    return parallel({
      one: function (cb) {
        helpers.rasync(1, cb)
      },
      two: function (cb) {
        helpers.rasync(2, cb)
      }
    }).then(function (results) {
      assert.deepEqual(results, {
        one: 1, two: 2
      })
    })
  })

  it('should acsept array with tasks', function () {
    return parallel([
      function (cb) {
        helpers.rasync(1, cb)
      },
      function (cb) {
        helpers.rasync(2, cb)
      }
    ]).then(function (results) {
      assert.deepEqual(results, [1, 2])
    })
  })

  it('should suport sync, async, promise and generator', function () {
    return parallel([
      function () {
        return 1
      },
      function (cb) {
        helpers.rasync(2, cb)
      },
      function () {
        return helpers.rpromise(3)
      },
      function * fn () {
        return yield helpers.rpromise(4)
      }
    ]).then(function (results) {
      assert.deepEqual(results, [1, 2, 3, 4])
    })
  })
})

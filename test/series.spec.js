var series = require('../lib/series')
var assert = require('assert')
var helpers = require('./helpers')
var sinon = require('sinon')

describe('series', function () {
  it('should support node style callback', function (done) {
    series([
      function (cb) {
        helpers.rasync(1, cb)
      }
    ], done)
  })

  it('should pass error in node style callback', function (done) {
    series([
      function (cb) {
        cb(new Error())
      }
    ], function (err, results) {
      assert(err)
      done()
    })
  })

  it('should pass throwed error in node style callback', function (done) {
    series([
      function (cb) {
        throw new Error()
      }
    ], function (err, results) {
      assert(err)
      done()
    })
  })

  it('should return promise', function (done) {
    series([
      function (cb) {
        helpers.rasync(1, cb)
      }
    ]).then(done.bind(null, null), done)
  })

  it('should pass error in promise', function () {
    return series([
      function (cb) {
        cb(new Error())
      }
    ]).then(null, function (err) {
      assert(err)
    })
  })

  it('should pass throwed error in promise', function () {
    return series([
      function (cb) {
        throw new Error()
      }
    ]).then(null, function (err) {
      assert(err)
    })
  })

  it('should acsept object with tasks', function () {
    return series({
      one: function (cb) {
        helpers.rasync(1, cb)
      },
      two: function (cb) {
        helpers.rasync(2, cb)
      }
    }).then(function (results) {
      assert.deepEqual(results, { one: 1, two: 2 })
    })
  })

  it('should acsept array with tasks', function () {
    return series([
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
    return series([
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

  it('should call tasks in seiries', function () {
    var spy1, spy2, spy3, spy4
    var spy = sinon.spy(helpers, 'rasync')

    return series([
      function (cb1) {
        spy1 = sinon.spy(cb1)
        helpers.rasync(1, spy1)
      },
      function (cb2) {
        spy2 = sinon.spy(cb2)
        helpers.rasync(2, spy2)
      },
      function (cb3) {
        spy3 = sinon.spy(cb3)
        helpers.rasync(3, spy3)
      },
      function (cb4) {
        spy4 = sinon.spy(cb4)
        helpers.rasync(4, spy4)
      }
    ]).then(function (results) {
      assert.deepEqual(results, [1, 2, 3, 4])
      assert(spy1.calledBefore(spy.withArgs(2)))
      assert(spy2.calledBefore(spy.withArgs(3)))
      assert(spy3.calledBefore(spy.withArgs(4)))
      helpers.rasync.restore()
    })
  })
})

var waterfall = require('../lib/waterfall')
var assert = require('assert')
var Q = require('q')
var helpers = require('./helpers')
var sinon = require('sinon')

describe('waterfall', function () {
  it('should support node style callback', function (done) {
    waterfall([
      function (cb) {
        helpers.rasync(1, cb)
      }
    ], done)
  })

  it('should pass error in node style callback', function (done) {
    waterfall([
      function (cb) {
        cb(new Error())
      }
    ], function (err, results) {
      assert(err)
      done()
    })
  })

  it('should pass throwed error in node style callback', function (done) {
    waterfall([
      function (cb) {
        throw new Error()
        helpers.rasync(1, cb)
      }
    ], function (err, results) {
      assert(err)
      done()
    })
  })

  it('should return promise', function (done) {
    waterfall([
      function (cb) {
        helpers.rasync(1, cb)
      }
    ])
      .then(done.bind(null, null), done)
  })

  it('should pass error in promise', function () {
    return waterfall([
      function (cb) {
        cb(new Error())
      }
    ])
      .then(null, function (err) {
        assert(err)
      })
  })

  it('should pass throwed error in promise', function () {
    return waterfall([
      function (cb) {
        throw new Error()
        helpers.rasync(1, cb)
      }
    ])
      .then(null, function (err) {
        assert(err)
      })
  })

  it('should acsept array with tasks', function () {
    return waterfall([
      function (cb) {
        helpers.rasync(1, cb)
      },
      function (num, cb) {
        helpers.rasync(num + 2, cb)
      }
    ])
      .then(function (results) {
        assert.equal(results, 3)
      })
  })

  it('should suport sync, async, promise and generator', function () {
    return waterfall([
      function () {
        return 1
      },
      function (num, cb) {
        helpers.rasync(num + 2, cb)
      },
      function (num) {
        return helpers.rpromise(num * 3)
      },
      function * fn (num) {
        return yield helpers.rpromise(num * 4)
      },
    ])
      .then(function (results) {
        assert.deepEqual(results, 36)
      })
  })

  it('should call tasks in seiries', function () {
    var spy1, spy2, spy3, spy4
    var spy = sinon.spy(helpers, 'rasync')
    return waterfall([
      function (cb1) {
        spy1 = sinon.spy(cb1)
        helpers.rasync(1, spy1)
      },
      function (num, cb2) {
        spy2 = sinon.spy(cb2)
        helpers.rasync(num + 2, spy2)
      },
      function (num, cb3) {
        spy3 = sinon.spy(cb3)
        helpers.rasync(num + 3, spy3)
      },
      function (num, cb4) {
        spy4 = sinon.spy(cb4)
        helpers.rasync(num + 4, spy4)
      },
    ])
      .then(function (results) {
        assert(spy1.calledBefore(spy.withArgs(3)))
        assert(spy2.calledBefore(spy.withArgs(6)))
        assert(spy3.calledBefore(spy.withArgs(10)))
        helpers.rasync.restore()
      })
  })
})

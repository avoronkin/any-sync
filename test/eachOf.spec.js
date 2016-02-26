var eachOf = require('../lib/eachOf')
var assert = require('assert')
var Promise = require('bluebird')
var helpers = require('./helpers')

describe('eachOf', function () {
  it('should support node style callback as iterator', function (done) {
    var results = []

    eachOf([2, 3, 4], function (value, key, cb) {
      helpers.rdelay(function () {
        results[key] = value * 2
        cb(null)
      })
    },
      function (err) {
        if (err) {
          return done(err)
        }
        assert.deepEqual(results, [4, 6, 8])
        done()
      })
  })

  it('should support promise as iterator', function () {
    var results = {}

    return eachOf({one: 2, two: 3, three: 4}, function (value, key) {
      return new Promise(function (resolve) {
        helpers.rdelay(function () {
          results[key] = value * 2
          resolve()
        })
      })
    })
      .then(function () {
        assert.deepEqual(results, {one: 4, two: 6, three: 8})
      })
  })

  it('should support sync function as iterator', function () {
    var results = []

    return eachOf([2, 3, 4], function (value, key) {
      results[key] = value * 2
    })
      .then(function () {
        assert.deepEqual(results, [4, 6, 8])
      })
  })

  it('should support generator function as iterator', function () {
    var results = []

    function asyncFn (value, key) {
      return new Promise(function (resolve) {
        helpers.rdelay(function () {
          results[key] = value * 2
          resolve()
        })
      })
    }

    return eachOf([2, 3, 4], function * (value, key) {
      yield asyncFn(value, key)
    })
      .then(function () {
        assert.deepEqual(results, [4, 6, 8])
      })
  })

  it('should return promise', function (done) {
    var results = []

    eachOf([2, 3, 4], function (value, key) {
      results[key] = value * 2
    })
      .then(function () {
        assert.deepEqual(results, [4, 6, 8])
        done()
      }, done)
  })

  it('should support node style callback', function (done) {
    var results = []

    eachOf([2, 3, 4], function (value, key) {
      results[key] = value * 2
    }, function (err) {
      if (err) {
        return done(err)
      }
      assert.deepEqual(results, [4, 6, 8])
      done()
    })
  })
})

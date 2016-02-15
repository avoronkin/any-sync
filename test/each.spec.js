var each = require('../lib/each')
var assert = require('assert')
var Promise = require('bluebird')
var helpers = require('./helpers')

describe('each', function () {
  it('should support node style callback as iterator', function (done) {
    var results = []

    each([2, 3, 4], function (item, cb) {
      helpers.rdelay(function () {
        results.push(item * 2)
        cb(null)
      })
    },
      function (err) {
        if (err) {
          return done(err)
        }
        assert(results.indexOf(4) > -1)
        assert(results.indexOf(6) > -1)
        assert(results.indexOf(8) > -1)
        done()
      })
  })

  it('should support promise as iterator', function (done) {
    var results = []

    each([2, 3, 4], function (item) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          results.push(item * 2)
          resolve()
        }, 50)
      })
    })
      .then(function () {
        assert(results.indexOf(4) > -1)
        assert(results.indexOf(6) > -1)
        assert(results.indexOf(8) > -1)
        done()
      }, done)
  })

  it('should support sync function as iterator', function (done) {
    var results = []

    each([2, 3, 4], function (item) {
      results.push(item * 2)
    })
      .then(function () {
        assert(results.indexOf(4) > -1)
        assert(results.indexOf(6) > -1)
        assert(results.indexOf(8) > -1)

        done()
      }, done)
  })

  it('should support generator function as iterator', function (done) {
    var results = []

    function asyncFn (item) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          results.push(item * 2)
          resolve()
        }, 35)
      })
    }

    each([2, 3, 4], function * fn (item) {
      yield asyncFn(item)
    })
      .then(function () {
        assert(results.indexOf(4) > -1)
        assert(results.indexOf(6) > -1)
        assert(results.indexOf(8) > -1)
        done()
      }, done)
  })

  it('should return promise', function (done) {
    var results = []

    each([2, 3, 4], function (item) {
      results.push(item * 2)
    })
      .then(function () {
        assert(results.indexOf(4) > -1)
        assert(results.indexOf(6) > -1)
        assert(results.indexOf(8) > -1)

        done()
      }, done)
  })

  it('should support node style callback', function (done) {
    var results = []

    each([2, 3, 4], function (item) {
      results.push(item * 2)
    }, function (err) {
      if (err) {
        return done(err)
      }
      assert(results.indexOf(4) > -1)
      assert(results.indexOf(6) > -1)
      assert(results.indexOf(8) > -1)

      done()
    })
  })
})

var eachOfSeries = require('../lib/eachOfSeries')
var assert = require('assert')

describe('eachOfSeries', function () {
  it('should process "each series" with sync', function (done) {
    var results = []
    eachOfSeries([1, 2, 3], function (item) {
      results.push(item * 2)
    })
      .then(function () {
        assert.deepEqual(results, [2, 4, 6])
        done()
      }, done)
  })

  it('should process "each series" with async', function (done) {
    var results = []
    eachOfSeries([1, 2, 3], function (item, cb) {
      setTimeout(function () {
        results.push(item * 2)
        cb()
      }, 50)
    })
      .then(function () {
        assert.deepEqual(results, [2, 4, 6])
        done()
      }, done)
  })

  it('should process "each series" with promise', function (done) {
    var results = []
    eachOfSeries([1, 2, 3], function (item) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          results.push(item * 2)
          resolve()
        }, 50)
      })
    })
      .then(function () {
        assert.deepEqual(results, [2, 4, 6])
        done()
      }, done)
  })

  it('should support callback style', function (done) {
    var results = []
    eachOfSeries([1, 2, 3], function (item) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          results.push(item * 2)
          resolve()
        }, 50)
      })
    }, function (err) {
      if (err) {
        return done(err)
      }
      assert.deepEqual(results, [2, 4, 6])
      done()
    })
  })
})

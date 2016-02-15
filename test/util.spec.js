var util = require('../lib/util')
var map = require('../lib/map')
var assert = require('assert')
var preocessArrayOrObject = util.processArrayOrObject

describe('util', function () {
  describe('processArrayOrObbject', function () {
    it('should process array', function (done) {
      preocessArrayOrObject([1, 2, 3], function (array) {
        return array.map(function (item) {
          return item * 3
        })
      })
        .then(function (results) {
          assert.deepEqual(results, [3, 6, 9])
          done()
        }, done)
    })

    it('should process object', function (done) {
      preocessArrayOrObject({
        one: 1,
        two: 2,
        three: 3
      }, function (array) {
        return array.map(function (item) {
          return item * 3
        })
      })
        .then(function (results) {
          assert.deepEqual(results, {
            one: 3,
            two: 6,
            three: 9
          })
          done()
        }, done)
    })

    it('should process with async fn', function (done) {
      preocessArrayOrObject([1, 2, 3], function (array, cb) {
        map(array, function (item, cb) {
          setTimeout(function () {
            cb(null, item * 3)
          }, 50)
        }, cb)
      })
        .then(function (results) {
          assert.deepEqual(results, [3, 6, 9])
          done()
        }, done)
    })

    it('should process with promise fn', function (done) {
      preocessArrayOrObject([1, 2, 3], function (array) {
        return map(array, function (item, cb) {
          setTimeout(function () {
            cb(null, item * 3)
          }, 50)
        })
          .then(function (results) {
            assert.deepEqual(results, [3, 6, 9])
            done()
          }, done)
      })
        .then(function (results) {
          assert.deepEqual(results, [3, 6, 9])
          done()
        }, done)
    })
  })
})

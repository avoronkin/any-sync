var map = require('../lib/map')
var assert = require('assert')
function getRandom (min, max) {
  return Math.random() * (max - min) + min
}

describe('map', function () {
  it('should support node style callback as iterator', function (done) {
    map([2, 3, 4], function (item, cb) {
      var delay = getRandom(1, 50)
      setTimeout(function () {
        cb(null, item * 2)
      }, delay)
    },
      function (err, results) {
        if (err) {
          return done(err)
        }
        assert.deepEqual(results, [4, 6, 8])
        done()
      })
  })

  it('should support promise as iterator', function (done) {
    map([2, 3, 4], function (item) {
      var delay = getRandom(1, 50)
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(item * 2)
        }, delay)
      })
    }).then(function (results) {
      assert.deepEqual(results, [4, 6, 8])
      done()
    }, done)
  })

  it('should support sync function as iterator', function (done) {
    map([2, 3, 4], function (item) {
      return item * 2
    }).then(function (results) {
      assert.deepEqual(results, [4, 6, 8])
      done()
    }, done)
  })

  it('should return promise', function (done) {
    map([2, 3, 4], function (item) {
      var delay = getRandom(1, 50)
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(item * 2)
        }, delay)
      })
    }).then(function (results) {
      assert.deepEqual(results, [4, 6, 8])
      done()
    }, done)
  })
})

var reduce = require('../lib/reduce')
var assert = require('assert')
var helpers = require('./helpers')

describe('reduce', function () {
  it('shouls return promise', function () {
    return reduce([1, 2, 3], 0, function (memo, item, callback) {
      helpers.rasync(memo + item, callback)
    }).then(function (result) {
      assert(result, 6)
    })
  })

  it('shouls support node style callback', function () {
    return reduce([1, 2, 3], 0, function (memo, item, callback) {
      helpers.rasync(memo + item, callback)
    }, function (err, result) {
      assert.ifError(err)
      assert(result, 6)
    })
  })

  it('iteratee function can be async', function () {
    return reduce([1, 2, 3], 0, function (memo, item, callback) {
      helpers.rasync(memo + item, callback)
    }).then(function (result) {
      assert(result, 6)
    })
  })

  it('iteratee function can be promise', function () {
    return reduce([1, 2, 3], 0, function (memo, item) {
      return helpers.rpromise(memo + item)
    }).then(function (result) {
      assert(result, 6)
    })
  })

  it('iteratee function can be sync', function () {
    return reduce([1, 2, 3], 0, function (memo, item) {
      return memo + item
    }).then(function (result) {
      assert(result, 6)
    })
  })
})

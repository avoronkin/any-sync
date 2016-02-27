var assert = require('assert')
var util = require('../lib/util')
var keyIterator = util.keyIterator

describe('util', function () {
  describe('keyIterator', function () {
    it('should iterate over object keys', function () {
      var obj = { one: 1, two: 2, three: 3 }
      var nextKey = keyIterator(obj)

      assert.equal(nextKey(), 'one')
      assert.equal(nextKey(), 'two')
      assert.equal(nextKey(), 'three')
      assert.equal(nextKey(), null)
    })

    it('should iterate over array indexes', function () {
      var arr = ['one', 'two', 'three']
      var nextKey = keyIterator(arr)

      assert.equal(nextKey(), 0)
      assert.equal(nextKey(), 1)
      assert.equal(nextKey(), 2)
      assert.equal(nextKey(), null)
    })
  })
})

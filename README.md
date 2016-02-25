# any-sync [WIP]

Like async but support sync, callbacks, promises and generators

```javascript
var anysync = require('any-sync')
var Promise = require('bluebird')
var assert = require('assert')

anysync.auto({
  one: function () {
    return 1
  },
  two: ['one', function (results, cb) {
    cb(null, results.one + 2)
  }],
  three: ['two', function (results) {
    return new Promise(function(resolve) {
      resolve(results.two + 3)
    }
  }]
}, function (err, results) {
  assert.ifError(err)
  assert.deepEqual(results, {one: 1, two: 3, three: 6})
})

```

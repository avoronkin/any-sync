var _ = require('lodash')
var Q = require('q')

module.exports = {
  rasync: function (value, cb) {
    this.rdelay(function () {
      cb(null, value)
    })
  },
  rpromise: function (value) {
    var that = this
    return Q.Promise(function (resolve) {
      that.rdelay(function () {
        resolve(value)
      })
    })
  },
  rdelay: function (fn) {
    setTimeout(fn, _.random(0, 20))
  }
}

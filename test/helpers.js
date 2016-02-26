var _ = require('lodash')
var Promise = require('bluebird')

module.exports = {
  rasync: function (value, cb) {
    this.rdelay(function () {
      cb(null, value)
    })
  },
  rpromise: function (value) {
    var that = this
    return new Promise(function (resolve) {
      that.rdelay(function () {
        resolve(value)
      })
    })
  },
  rdelay: function (fn) {
    setTimeout(fn, _.random(0, 20))
  }
}

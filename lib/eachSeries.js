var eachOfSeries = require('./eachOfSeries')
var withoutIndex = require('./util').withoutIndex

module.exports = function eachSeries (collection, iterator, callback) {
  return eachOfSeries(collection, withoutIndex(iterator), callback)
}

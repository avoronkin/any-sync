var eachOf = require('./eachOf')
var withoutIndex = require('./util').withoutIndex

module.exports = function each (collection, iterator, callback) {
  return eachOf(collection, withoutIndex(iterator), callback)
}

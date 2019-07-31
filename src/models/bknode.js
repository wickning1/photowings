const mongoose = require('mongoose')
const { distance } = require('../lib/phash')
const { hashToBinary } = require('../lib/helpers')

const BKNodeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    index: true
  },
  edges: [String]
})

function getDistance (hash1, hash2) {
  return distance(hashToBinary(hash1), hashToBinary(hash2))
}

BKNodeSchema.methods.add = async function (hashtoadd) {
  if (this._id === hashtoadd) return
  const distance = getDistance(this._id, hashtoadd)
  if (this.edges[distance]) {
    const node = await this.constructor.findById(this.edges[distance])
    await node.add(hashtoadd)
  } else {
    this.edges[distance] = hashtoadd
    await this.save()
  }
}

BKNodeSchema.methods.search = function (searchhash, threshold, results) {
  const distance = getDistance(this._id, searchhash)
  if (distance < threshold) results.push(this._id)
  const ret = []
  for (let i = Math.max(0, distance - threshold); i <= Math.min(64, distance + threshold); i++) {
    ret.push(this.edges[i])
  }
  return ret
}

module.exports = mongoose.model('BKNode', BKNodeSchema)

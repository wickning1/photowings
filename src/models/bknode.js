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

function getDistance (value1, value2) {
  return distance(hashToBinary(value1), hashToBinary(value2))
}

BKNodeSchema.methods.add = async function (value) {
  if (this._id === value) return
  const distance = getDistance(this._id, value)
  if (this.edges[distance]) {
    const node = await this.constructor.findById(this.edges[distance])
    await node.add(value)
  } else {
    this.edges[distance] = value
    await this.save()
  }
}

BKNodeSchema.methods.search = function (searchvalue, threshold, results) {
  const distance = getDistance(this._id, searchvalue)
  if (distance < threshold) results.push({ value: this._id, distance: distance })
  const ret = []
  for (let i = Math.max(0, distance - threshold); i <= Math.min(64, distance + threshold); i++) {
    ret.push(this.edges[i])
  }
  return ret
}

module.exports = mongoose.model('BKNode', BKNodeSchema)

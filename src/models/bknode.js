const mongoose = require('mongoose')
const hamming = require('wink-distance/src/string-hamming')

const BKNodeSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    index: true
  },
  edges: [String]
}, { _id: false })

BKNodeSchema.methods.add = async function () {
  const distance =
}

module.exports = mongoose.model('BKNode', BKNodeSchema)

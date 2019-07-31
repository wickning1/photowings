const mongoose = require('mongoose')

const BKTreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  root: {
    type: String,
    ref: 'BKNode',
    required: true
  }
}, { _id: false })

BKTreeSchema.methods.add = async function (hashtoadd) {
  this.root.add(hashtoadd)
}

function getNextSet (searchhash, threshold, currentset, results) {
  const ret = []
  for (const node of currentset) {
    ret.push(...node.search(searchhash, threshold, results))
  }
  return ret
}

BKTreeSchema.methods.search = async function (searchhash, threshold) {
  let current = [this.root]
  const results = []
  while (current.length) {
    const nexthashes = getNextSet(searchhash, threshold, current, results)
    if (nexthashes.length) current = BKNode.find({ _id: { $in: nexthashes } })
    else current = []
  }
  return results
}

BKTreeSchema.statics.get = async function (name) {
  return this.findOne({ name }).populate('root')
}

module.exports = mongoose.model('BKTree', BKTreeSchema)
const BKNode = require('./bknode')

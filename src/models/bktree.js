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
  },
  editing: Boolean
}, { _id: false })

BKTreeSchema.methods.add = async function (value) {
  // TODO: set this.editing atomically as a way to lock the tree - we can't allow concurrent adds
  const existing = await BKNode.findById(value)
  if (!existing) await this.root.add(value)
}

function getNextSet (searchvalue, threshold, currentset, results) {
  const ret = []
  for (const node of currentset) {
    ret.push(...node.search(searchvalue, threshold, results))
  }
  return ret
}

BKTreeSchema.methods.search = async function (searchvalue, threshold) {
  let current = [this.root]
  const results = []
  while (current.length) {
    const nexthashes = getNextSet(searchvalue, threshold, current, results)
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

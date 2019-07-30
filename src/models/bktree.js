const mongoose = require('mongoose')

const BKTreeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  roothash: {
    type: String,
    required: true
  }
}, { _id: false })

BKTreeSchema.methods.add = async function (hashtoadd) {
  const root = await BKNode.findOne({ hash: this.roothash })
  root.add(hashtoadd)
}

module.exports = mongoose.model('BKTree', BKTreeSchema)
const BKNode = require('./bknode')

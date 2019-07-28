const mongoose = require('mongoose')
const _ = require('txstate-node-utils/lib/util')
const monhelp = require('txstate-node-utils/lib/mongoose')
const helpers = require('../lib/helpers')

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  }
})

PersonSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

PersonSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser)
  }
}

PersonSchema.statics.populatePartial = function () {
  return []
}

PersonSchema.statics.populateFull = async function (target) {
  return monhelp.populate(target, [
    ...this.populatePartial()
  ])
}


module.exports = mongoose.model('Person', PersonSchema)

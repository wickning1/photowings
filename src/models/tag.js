const mongoose = require('mongoose')
const monhelp = require('txstate-node-utils/lib/mongoose')

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  }
})

TagSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

TagSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser)
  }
}

TagSchema.statics.populatePartial = function () {
  return []
}

TagSchema.statics.populateFull = async function (target) {
  return monhelp.populate(target, [
    ...this.populatePartial()
  ])
}

module.exports = mongoose.model('Tag', TagSchema)

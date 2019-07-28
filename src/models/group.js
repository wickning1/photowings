const mongoose = require('mongoose')
const _ = require('txstate-node-utils/lib/util')
const monhelp = require('txstate-node-utils/lib/mongoose')
const helpers = require('../lib/helpers')

const GroupSchema = new mongoose.Schema({
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  users: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }]
})

GroupSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

GroupSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    notes: this.notes,
    owner: this.owner.partial(requser)
  }
}

GroupSchema.statics.populatePartial = function () {
  return []
}

GroupSchema.statics.populateFull = async function (target) {
  const User = mongoose.model('User')
  return monhelp.populate(target, [
    ...this.populatePartial(),
    { path: 'owner', populate: User.populatePartial() },
    { path: 'users', populate: User.populatePartial() },
  ])
}


module.exports = mongoose.model('Group', GroupSchema)

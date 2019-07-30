const mongoose = require('mongoose')
const monhelp = require('txstate-node-utils/lib/mongoose')

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  // share/unshare only allows adding/removing roles with level >= the current user's role level
  level: {
    type: Number,
    required: true
  },
  addphotos: Boolean,
  editphotos: Boolean,
  tagphotos: Boolean,
  removephotos: Boolean,
  share: Boolean,
  unshare: Boolean,
  editalbum: Boolean,
  deletealbum: Boolean
})

RoleSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

RoleSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    level: this.level,
    addphotos: this.addphotos,
    editphotos: this.editphotos,
    tagphotos: this.tagphotos,
    removephotos: this.removephotos,
    share: this.share,
    unshare: this.unshare,
    editalbum: this.editalbum,
    deletealbum: this.deletealbum
  }
}

RoleSchema.statics.populatePartial = function () {
  return []
}

RoleSchema.statics.populateFull = async function (target) {
  return monhelp.populate(target, [
    ...this.populatePartial()
  ])
}

module.exports = mongoose.model('Role', RoleSchema)

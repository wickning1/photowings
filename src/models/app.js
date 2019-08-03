const mongoose = require('mongoose')
const monhelp = require('txstate-node-utils/lib/mongoose')

const AppSchema = new mongoose.Schema({
  key: {
    type: String,
    trim: true,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  album: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
    share: Boolean // controls the sharing endpoint, update endpoint cannot change permissions
  },
  image: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean,
    tag: Boolean // only controls the tagging-only endpoint, update endpoint can also write tags
  },
  group: {
    create: Boolean,
    read: Boolean,
    update: Boolean,
    delete: Boolean
  }
})

AppSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

AppSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    addphotos: this.addphotos,
    editphotos: this.editphotos,
    tagphotos: this.tagphotos,
    removephotos: this.removephotos,
    share: this.share,
    unshare: this.unshare,
    setowner: this.setowner,
    editalbum: this.editalbum,
    deletealbum: this.deletealbum
  }
}

AppSchema.statics.populatePartial = function () {
  return []
}

AppSchema.statics.populateFull = async function (target) {
  const User = mongoose.model('User')
  return monhelp.populate(target, [
    ...this.populatePartial(),
    { path: 'owner', populate: User.populatePartial() },
    { path: 'users', populate: User.populatePartial() }
  ])
}

module.exports = mongoose.model('App', AppSchema)

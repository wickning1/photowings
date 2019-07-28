const mongoose = require('mongoose')
const _ = require('txstate-node-utils/lib/util')
const monhelp = require('txstate-node-utils/lib/mongoose')
const helpers = require('../lib/helpers')

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  firsttaken: {
    type: Date,
    index: true
  },
  lasttaken: {
    type: Date,
    index: true
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  groups: [{
    group: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Group'
    },
    role: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Role'
    }
  }],
  users: [{
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
    },
    role: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Role'
    }
  }]
})

AlbumSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name,
    firsttaken: this.firsttaken,
    lasttaken: this.lasttaken
  }
}

AlbumSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    notes: this.notes,
    owner: this.owner.partial(requser),
    groups: this.groups.map(g => ({
      group: g.group.partial(requser),
      role: g.role.partial(requser)
    })),
    users: this.users.map(u => ({
      user: u.user.partial(requser),
      role: u.role.partial(requser)
    }))
  }
}

AlbumSchema.statics.populatePartial = function () {
  return []
}

AlbumSchema.statics.populateFull = async function (target) {
  const User = mongoose.model('User')
  const Group = mongoose.model('Group')
  const Role = mongoose.model('Role')
  return monhelp.populate(target, [
    ...this.populatePartial(),
    { path: 'owner', populate: User.populatePartial() },
    { path: 'groups.group', populate: Group.populatePartial() },
    { path: 'groups.role', populate: Role.populatePartial() },
    { path: 'users.user', populate: User.populatePartial() },
    { path: 'users.role', populate: Role.populatePartial() }
  ])
}


module.exports = mongoose.model('Album', AlbumSchema)

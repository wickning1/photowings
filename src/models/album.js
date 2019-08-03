const mongoose = require('mongoose')
const monhelp = require('txstate-node-utils/lib/mongoose')

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  filepath: {
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
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Album'
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
    filepath: this.filepath,
    notes: this.notes,
    ...(this.parent ? { parent: this.parent.partial(requser) } : {}),
    ...(this.owner ? { owner: this.owner.partial(requser) } : {}),
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
    { path: 'users.role', populate: Role.populatePartial() },
    { path: 'parent', populate: this.populatePartial() }
  ])
}

AlbumSchema.statics.getMany = async function (requser, query) {
  const limit = query.pp || 500
  const offset = ((query.p || 1) - 1) * limit
  const sort = query.sort ? { [query.sort]: query.desc ? -1 : 1 } : { filepath: 1 }
  const results = await this.find({ deleted: { $ne: true } }).skip(offset).limit(limit).sort(sort)
  return this.populateFull(results)
}

module.exports = mongoose.model('Album', AlbumSchema)

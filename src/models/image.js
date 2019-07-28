const mongoose = require('mongoose')
const _ = require('txstate-node-utils/lib/util')
const monhelp = require('txstate-node-utils/lib/mongoose')
const helpers = require('../lib/helpers')

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    trim: true,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  uploadedby: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  album: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Album'
  },
  people_featured: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Person'
  }],
  people_related: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Person'
  }],
  tags: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Tag'
  }],
  taken: {
    type: Date,
    index: true
  },
  taken_is_guess: Boolean,
  created: {
    type: Date,
    index: true
  },
  modified: {
    type: Date,
    index: true
  },
  uploaded: {
    type: Date,
    index: true
  }
})

ImageSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    title: this.name || helpers.nameToTitle(this.filename),
    taken: this.taken,
    album: this.album.partial(requser)
  }
}

ImageSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    tags: this.tags.map(t => t.partial(requser))
  }
}

ImageSchema.statics.populatePartial = function () {
  const Album = mongoose.model('Album')
  return [{ path: 'album', populate: Album.populatePartial() }]
}

ImageSchema.statics.populateFull = async function (target) {
  const Person = mongoose.model('Person')
  const Tag = mongoose.model('Tag')
  const User = mongoose.model('User')
    return monhelp.populate(target, [
    ...this.populatePartial(),
    { path: 'uploadedby', populate: User.populatePartial() },
    { path: 'people_featured', populate: Person.populatePartial() },
    { path: 'people_related', populate: Person.populatePartial() },
    { path: 'tags', populate: Tag.populatePartial() }
  ])
}

ImageSchema.statics.getMany = async function (requser, query) {
  return this.find()
}

module.exports = mongoose.model('Image', ImageSchema)

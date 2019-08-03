const mongoose = require('mongoose')
const monhelp = require('txstate-node-utils/lib/mongoose')
const helpers = require('../lib/helpers')
const path = require('path')

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}, { _id: false })

const ImageSchema = new mongoose.Schema({
  filepath: {
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
    ref: 'Album',
    required: true
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
  description: String,
  taken: {
    type: Date,
    index: true
  },
  taken_is_guess: Boolean,
  modified: {
    type: Date,
    index: true
  },
  uploaded: {
    type: Date,
    index: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  phash: {
    type: String,
    required: true
  },
  orientation: Number,
  location: PointSchema,
  filesize: {
    type: Number,
    required: true
  },
  mime: {
    type: String,
    required: true
  },
  deleted: Boolean,
  scanid: {
    type: String,
    index: true
  },
  scanversion: {
    type: Number,
    required: true,
    min: helpers.scanVersion
  }
})
ImageSchema.index({ location: '2dsphere' })

ImageSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    width: this.width,
    height: this.height,
    name: this.name || helpers.nameToTitle(path.basename(this.filepath, path.extname(this.filepath))),
    taken: this.taken,
    album: this.album.partial(requser)
  }
}

ImageSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    tags: this.tags.map(t => t.partial(requser)),
    ...(this.location ? {
      longitude: this.location.coordinates[0],
      latitude: this.location.coordinates[1]
    } : {})
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
  const limit = query.pp || 50
  const offset = ((query.p || 1) - 1) * limit
  const sort = query.sort ? { [query.sort]: query.desc ? -1 : 1 } : { taken: 1 }
  const where = [{ deleted: { $ne: true } }]
  if (query.album) where.push({ album: query.album })
  const results = await this.find({ $and: where }).skip(offset).limit(limit).sort(sort)
  return this.populateFull(results)
}

module.exports = mongoose.model('Image', ImageSchema)

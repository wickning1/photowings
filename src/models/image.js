const mongoose = require('mongoose')
const _ = require('txstate-node-utils/lib/util')
const monhelp = require('txstate-node-utils/lib/mongoose')
const shelpers = require('../lib/serverhelpers')
const { nameToTitle, defaultTZ } = require('../lib/helpers')
const path = require('path')
const geoTz = require('geo-tz')
const moment = require('moment-timezone')

const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true,
    default: [0, 0]
  },
  timeZone: String
}, { _id: false })

// all the values that can be obtained from the image
// but the user is allowed to override them during edits
class OverrideSchema extends mongoose.Schema {
  constructor () {
    super(...arguments)
    this.add({
      description: {
        type: String,
        trim: true
      },
      taken: Date,
      orientation: {
        type: Number,
        min: 1,
        max: 8
      },
      location: PointSchema,
      deleted: {
        type: Boolean,
        index: true
      }
    })
  }
}

const SubOverrideSchema = new OverrideSchema({}, { _id: false })

const ImageSchema = new OverrideSchema({
  filepath: {
    type: String,
    trim: true,
    required: true
  },
  mime: {
    type: String,
    required: true
  },
  filesize: {
    type: Number,
    required: true
  },
  modified: {
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
  taken_is_guess: Boolean,
  file: {
    type: SubOverrideSchema,
    default: {}
  },
  overrides: {
    type: SubOverrideSchema,
    default: {}
  },
  name: {
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
    required: true,
    index: true
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
    ref: 'Tag',
    index: true
  }],
  deleted: {
    type: Boolean,
    index: true
  },
  scanid: {
    type: String,
    index: true
  },
  scanversion: {
    type: Number,
    required: true,
    min: shelpers.scanVersion
  }
})
ImageSchema.index({ location: '2dsphere' })
ImageSchema.index({ taken: 1 })

ImageSchema.methods.partial = function (requser) {
  const swapdims = this.orientation > 4
  return {
    id: this.id,
    width: swapdims ? this.height : this.width,
    height: swapdims ? this.width : this.height,
    title: this.name || nameToTitle(path.basename(this.filepath, path.extname(this.filepath))),
    description: this.description,
    taken: this.takenLocal(),
    album: this.album.partial(requser)
  }
}

ImageSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    description: this.description || '',
    orientation: this.orientation,
    uploadedby: this.uploadedby,
    alt: [
      this.description,
      ...this.tags.map(t => t.name),
      ...this.people_featured.map(p => p.name),
      ...this.people_related.map(p => p.name)
    ].join(', '),
    tags: this.tags.map(t => t.partial(requser)),
    people_featured: this.people_featured,
    people_related: this.people_related,
    ...(!_.isEmpty(this.location) ? {
      longitude: this.location.coordinates[0],
      latitude: this.location.coordinates[1]
    } : {})
  }
}

ImageSchema.methods.fromJson = async function (json, requser) {
  const Tag = mongoose.model('Tag')
  if (json.tags) {
    const finaltags = []
    const newtags = []
    for (const tag of json.tags) {
      const existingtag = this.tags.find(t => t.id === tag.id)
      if (existingtag) {
        finaltags.push(existingtag)
      } else if (mongoose.Types.ObjectId.isValid(tag.id)) {
        newtags.push(tag.id)
      } else {
        finaltags.push(new Tag({ name: tag.id }))
      }
    }
    if (newtags.length) {
      const populatednewtags = await Tag.find({ _id: { $in: newtags } })
      finaltags.push(...populatednewtags)
    }
    this.tags = finaltags
  }
  if (json.title) this.name = json.title
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

ImageSchema.statics.getById = async function (id, requser) {
  const image = await this.findById(id)
  await this.populateFull(image)
  return image
}

function filterList (list) {
  list = _.toArray(list)
  const listwithoutnone = list.filter(itm => itm !== '-1')
  return { hasNone: listwithoutnone.length !== list.length, list: listwithoutnone }
}

ImageSchema.statics.getMany = async function (requser, query) {
  const limit = query.pp || 100
  const offset = ((query.p || 1) - 1) * limit
  const sort = query.sort ? { [query.sort]: query.desc ? -1 : 1 } : { taken: 1 }
  const where = [{ deleted: { $ne: true } }]
  if (query.id) where.push({ _id: { $in: _.toArray(query.id) } })
  if (query.album) where.push({ album: query.album })
  if (query.tagsmay) {
    const or = []
    const { list, hasNone } = filterList(query.tagsmay)
    if (hasNone) or.push({ tags: { $eq: [] } })
    if (list.length) or.push({ tags: { $in: list } })
    if (or.length) where.push({ $or: or })
  }
  if (query.tagsmust) where.push({ tags: { $all: _.toArray(query.tagsmust) } })
  if (query.tagsnone) where.push({ tags: { $nin: _.toArray(query.tagsmust) } })
  const results = await this.find({ $and: where }).skip(offset).limit(limit).sort(sort)
  const [count, data] = await Promise.all([
    this.countDocuments({ $and: where }),
    this.populateFull(results)
  ])
  return shelpers.apiResponse(count, data, limit)
}

ImageSchema.methods.setLocation = function (latitude, longitude, override = true) {
  const loc = {
    type: 'Point',
    coordinates: [longitude, latitude],
    timeZone: geoTz(latitude, longitude)[0] || defaultTZ
  }
  if (override) this.overrides.location = loc
  else this.file.location = loc
}
ImageSchema.methods.takenLocal = function () {
  return moment(this.taken).tz(this.location ? this.location.timeZone : defaultTZ).format('YYYY-MM-DDTHH:mm:ssZZ')
}

ImageSchema.pre('validate', async function () {
  for (const key of Object.keys(SubOverrideSchema.paths).filter(p => !p.includes('.'))) {
    this[key] = this.overrides[key] || this.file[key]
  }
})

module.exports = mongoose.model('Image', ImageSchema)

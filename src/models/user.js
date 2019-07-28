const mongoose = require('mongoose')
const _ = require('txstate-node-utils/lib/util')
const monhelp = require('txstate-node-utils/lib/mongoose')
const helpers = require('../lib/helpers')

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  lastlogout: Date,
  admin: Boolean,
  person: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Person'
  }
})

UserSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

UserSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser),
    login: this.login,
    email: this.email,
    person: this.person.partial(requser),
    lastlogout: this.lastlogout,
    admin: this.admin
  }
}

UserSchema.statics.populatePartial = function () {
  return []
}

UserSchema.statics.populateFull = async function (target) {
  const Person = mongoose.model('Person')
  return monhelp.populate(target, [
    ...this.populatePartial(),
    { path: 'person', populate: Person.populatePartial() }
  ])
}


module.exports = mongoose.model('User', UserSchema)

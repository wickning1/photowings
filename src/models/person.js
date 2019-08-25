const mongoose = require('mongoose')
const monhelp = require('txstate-node-utils/lib/mongoose')

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  }
})

PersonSchema.methods.partial = function (requser) {
  return {
    id: this.id,
    name: this.name
  }
}

PersonSchema.methods.full = function (requser) {
  return {
    ...this.partial(requser)
  }
}

PersonSchema.statics.populatePartial = function () {
  return []
}

PersonSchema.statics.populateFull = async function (target) {
  return monhelp.populate(target, [
    ...this.populatePartial()
  ])
}

PersonSchema.statics.getMany = async function (requser, query) {
  const sort = query.sort ? { [query.sort]: query.desc ? -1 : 1 } : { name: 1 }
  const where = [{ deleted: { $ne: true } }]
  if (query.q) where.push({ name: { $regex: '^' + query.q, $options: 'i' } })
  const results = await this.find({ $and: where }).sort(sort)
  const data = await this.populateFull(results)
  return data
}

module.exports = mongoose.model('Person', PersonSchema)

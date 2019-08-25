import Tag from '../models/tag'

export default async function () {
  const tagnames = ['Vacation', 'Wedding', 'Birthday', 'Christmas']
  const tags = tagnames.map(name => new Tag({ name }))
  await Tag.deleteMany()
  await Promise.all(tags.map(async tag => tag.save({ validateBeforeSave: false })))
}

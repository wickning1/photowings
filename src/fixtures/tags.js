import Tag from '../models/tag'
import mongoose from 'mongoose'

export default async function () {
  const tags = [
    new Tag({ _id: mongoose.Types.ObjectId('5d6303dc31127a01f7408a51'), name: 'Birthday' }),
    new Tag({ _id: mongoose.Types.ObjectId('5d6303dc31127a01f7408a52'), name: 'Christmas' }),
    new Tag({ _id: mongoose.Types.ObjectId('5d6303dc31127a01f7408a4f'), name: 'Vacation' }),
    new Tag({ _id: mongoose.Types.ObjectId('5d6303dc31127a01f7408a50'), name: 'Wedding' })
  ]
  await Tag.deleteMany()
  await Promise.all(tags.map(async tag => tag.save({ validateBeforeSave: false })))
}

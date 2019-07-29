import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import _ from 'txstate-node-utils/lib/util'
import shelpers from './serverhelpers'
import Image from '../models/image'
import Album from '../models/album'
const fsp = fs.promises

export default async function () {
  const files = await findfiles('/photos')
  const images = []
  await _.batch(files, async filepath => {
    const isImage = await detectimage(filepath)
    if (isImage) await handle_image(filepath)
  }, 20)
  console.log('initial scan complete')
}

async function detectimage (filepath) {
  const mime = await shelpers.mime(filepath)
  return mime.startsWith('image')
}

async function findfiles (directory) {
  const ret = []
  const entries = await fsp.readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile()) ret.push(path.resolve(directory, entry.name))
    else if (entry.isDirectory()) {
      const files = await findfiles(path.resolve(directory, entry.name))
      ret.push(...files)
    }
  }
  return ret
}

async function handle_image(filepath) {
  const image = await Image.findOneAndUpdate({ filepath }, { $set: { filepath } }, { upsert: true, new: true })
  const albumpath = path.dirname(filepath)
  const album = await Album.findOneAndUpdate({ filepath: albumpath }, { $set: { filepath: albumpath } }, { upsert: true, new: true })
  image.album = album
  image.save()
}

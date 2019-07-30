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
  const scanid = _.generatestring(10)
  await _.batch(files, async filepath => {
    await handleImage(filepath, scanid)
  }, 20)
  await Image.updateMany({ scanid: { $ne: scanid } }, { deleted: true })
  console.log('initial scan complete')
  const watcher = chokidar.watch('/photos', { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 500 } })
  watcher.on('add', filepath => handleImage(filepath))
  watcher.on('change', filepath => handleImage(filepath))
  watcher.on('unlink', filepath => handleDelete(filepath))
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

async function handleImage (filepath, scanid) {
  const mime = await shelpers.mime(filepath)
  if (!mime.startsWith('image')) return
  const albumpath = path.dirname(filepath)
  const [image, album, fstat] = await Promise.all([
    Image.findOneAndUpdate({ filepath }, { $set: { filepath } }, { upsert: true, new: true }),
    Album.findOneAndUpdate({ filepath: albumpath }, { $set: { filepath: albumpath } }, { upsert: true, new: true }),
    fsp.stat(filepath)
  ])
  image.scanid = scanid
  image.album = album
  image.created = fstat.ctime
  image.modified = fstat.mtime
  image.filesize = fstat.size
  image.mime = mime
  image.deleted = false
  await image.save()
}

async function handleDelete (filepath) {
  const image = await Image.findOne({ filepath })
  if (image) {
    image.deleted = true
    await image.save()
  }
}

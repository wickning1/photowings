import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import _ from 'txstate-node-utils/lib/util'
import jimp from 'jimp'
import moment from 'moment-timezone'
import shelpers from './serverhelpers'
import Image from '../models/image'
import Album from '../models/album'
const fsp = fs.promises

export default async function () {
  const files = await findfiles('/photos')
  const scanid = _.generatestring(10)

  const watcher = chokidar.watch('/photos', { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 500 } })
  watcher.on('add', filepath => handleImage(filepath, scanid))
  watcher.on('change', filepath => handleImage(filepath, scanid))
  watcher.on('unlink', filepath => handleDelete(filepath))

  await _.batch(files, async filepath => {
    await handleImage(filepath, scanid)
  }, 20)
  await Image.updateMany({ scanid: { $ne: scanid } }, { deleted: true })

  console.log('initial scan complete')
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

function parseExifDate (exifDate) {
  if (!exifDate) return undefined
  const dt = moment(exifDate, ['YYYY:MM:DD HH:mm:ss', 'YYYY:MMDD:DD HH:mm:ss', 'YYYYMMDD', 'X'])
  if (dt.isValid()) return dt.toDate()
  console.log('unrecognizable date', exifDate)
  return undefined
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
  try {
    await image.validate()
    throw new Error('process all')
  } catch (e) {
    const img = await jimp.read(filepath)
    image.width = img.bitmap.width
    image.height = img.bitmap.height
    const info = img._exif
    if (info && !_.isEmpty(info.tags)) {
      image.orientation = info.tags.Orientation || 1
      if (info.tags.GPSLatitude && info.tags.GPSLongitude) {
        image.location = {
          type: 'Point',
          coordinates: [info.tags.GPSLongitude, info.tags.GPSLatitude]
        }
      }
      image.taken = parseExifDate(info.tags.DateTimeOriginal) || parseExifDate(info.tags.ModifyDate)
      if (!image.taken) {
        image.taken = fstat.mtime
        image.taken_is_guess = true
      }
    }
  }
  image.scanid = scanid
  image.album = album
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

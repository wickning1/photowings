import chokidar from 'chokidar'
import path from 'path'
import fs from 'fs'
import _ from 'txstate-node-utils/lib/util'
import sharp from 'sharp'
import exif from 'exif-reader'
import bmp from '@vingle/bmp-js'
import shelpers from './serverhelpers'
import { phash } from './phash'
import { binaryToHash } from './helpers'
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
    try {
      await handleImage(filepath, scanid)
    } catch (e) {
      console.error(e, filepath)
    }
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

function convertGPS (ref, array) {
  return (ref === 'S' || ref === 'W' ? -1 : 1) * (array[0] + array[1] / 60.0 + array[2] / 3600.0)
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
    try {
      let img
      image.orientation = 1
      if (mime === 'image/bmp') {
        const bmpbuffer = await fsp.readFile(filepath)
        const data = bmp.decode(bmpbuffer, true)
        image.width = data.width
        image.height = data.height
        img = await sharp(data.data, {
          raw: {
            width: data.width,
            height: data.height,
            channels: 4
          }
        })
      } else {
        img = await sharp(filepath)
        const meta = await img.metadata()
        image.width = meta.width
        image.height = meta.height
        const info = meta.exif ? exif(meta.exif) : {}
        if (info) {
          if (info.image) {
            if (info.image.Orientation) image.orientation = info.image.Orientation
            image.description = info.image.ImageDescription
          }
          if (info.exif) {
            image.taken = info.exif.DateTimeOriginal || info.exif.ModifyDate
          }
          if (info.gps && info.gps.GPSLatitude && info.gps.GPSLongitude) {
            image.location = {
              type: 'Point',
              coordinates: [
                convertGPS(info.gps.GPSLongitudeRef, info.gps.GPSLongitude),
                convertGPS(info.gps.GPSLatitudeRef, info.gps.GPSLatitude)
              ]
            }
          }
        }
        image.phash = binaryToHash(phash(img))
      }
      if (!image.taken) {
        image.taken = fstat.mtime
        image.taken_is_guess = true
      }
    } catch (err) {
      console.log(err)
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

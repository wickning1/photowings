import Image from '../../../../models/image'
import { RequestError } from 'txstate-node-utils/lib/error'
import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'
import sharp from 'sharp'
import exifmath from 'exif-orientation-math'

export async function get (req, res) {
  const image = await Image.findById(req.params.id)
  if (!image) throw new RequestError(404)
  const filepath = image.filepath
  const filename = path.basename(filepath)

  const ifsince = moment(req.headers['if-modified-since'])
  const modtime = moment(image.modified)

  res.setHeader('Last-Modified', modtime.format())
  res.setHeader('Cache-Control', 'private, must-revalidate, max-age=300')
  if (req.headers['if-modified-since'] && ifsince.isValid() && (modtime.isBefore(ifsince) || modtime.isSame(ifsince))) return res.status(304).send()

  res.setHeader('Content-Disposition', 'inline;filename="' + filename + '"')
  if (image.orientation !== 1) {
    const img = await sharp(filepath)
    const ops = exifmath.operations(image.orientation, { flop: true })
    const { data, info } = await img.flip(ops.flip).flop(ops.flop).rotate(ops.angle).toBuffer({ resolveWithObject: true })
    res.setHeader('Content-Type', 'image/' + info.format)
    res.setHeader('Content-Length', info.size)
    res.send(data)
  } else {
    res.setHeader('Content-Type', image.mime)
    res.setHeader('Content-Length', image.filesize)
    var stream = fs.createReadStream(filepath)
    stream.pipe(res)
  }
}

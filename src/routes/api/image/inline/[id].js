import Image from '../../../../models/image'
import { RequestError } from 'txstate-node-utils/lib/error'
import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'
import shelpers from '../../../../lib/serverhelpers'
const fsp = fs.promises

export async function get (req, res) {
  const image = await Image.findById(req.params.id)
  if (!image) throw new RequestError(404)
  const filepath = image.filepath
  const filename = path.basename(filepath)

  const ifsince = moment(req.headers['if-modified-since'])
  const modtime = moment(image.modified)

  res.setHeader('Last-Modified', modtime.format())
  if (req.headers['if-modified-since'] && ifsince.isValid() && (modtime.isBefore(ifsince) || modtime.isSame(ifsince))) return res.status(304).send()

  res.setHeader('Content-Type', image.mime)
  res.setHeader('Content-Disposition', 'inline;filename=' + filename)
  res.setHeader('Content-Length', image.filesize)

  var stream = fs.createReadStream(filepath)
  stream.pipe(res)
}

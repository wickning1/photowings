import Image from '../../../../models/image'
import { RequestError } from 'txstate-node-utils/lib/error'
import path from 'path'
import fs from 'fs'
import moment from 'moment-timezone'
import shelpers from '../../../../lib/serverhelpers'
const fsp = fs.promises

export async function get (req, res) {
  console.log('params', req.params)
  const image = await Image.findById(req.params.id)
  if (!image) throw new RequestError(404)
  const filepath = image.filepath
  const filename = path.basename(filepath)

  const ifsince = moment(req.headers['if-modified-since'])

  const stats = await fsp.stat(filepath)
  const modtime = moment(stats.mtime)

  res.setHeader('Last-Modified', new Date().toUTCString())
  if (req.headers['if-modified-since'] && ifsince.isValid() && (modtime.isBefore(ifsince) || modtime.isSame(ifsince))) return res.status(304).send()

  const mime = await shelpers.mime(filepath)

  res.setHeader('Content-Type', mime)
  res.setHeader('Content-Disposition', 'inline;filename=' + filename)
  res.setHeader('Content-Length', stats.size)

  var stream = fs.createReadStream(filepath)
  stream.pipe(res)
}

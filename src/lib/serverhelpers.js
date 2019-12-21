const fileType = require('file-type')
const fsp = require('fs').promises
const anybase = require('any-base')
const moment = require('moment-timezone')
const mongoose = require('mongoose')

const base64urlalphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
function convertMongoErrors (errors) {
  const ret = {}
  for (const e of Object.values(errors)) {
    ret[e.path] = [e.message]
  }
  return ret
}

module.exports = {
  mime: async function (filepath) {
    let file
    let mime = 'application/octet-stream'
    try {
      file = await fsp.open(filepath)
      const header = Buffer.alloc(fileType.minimumBytes)
      await file.read(header, 0, fileType.minimumBytes)
      mime = fileType(header).mime
    } finally {
      if (file !== undefined) await file.close()
    }
    return mime
  },
  timeAgo: function (dt) {
    return moment(dt).fromNow()
  },
  apiResponse: function (count, data, perpage) {
    return {
      info: {
        finalpage: Math.ceil(count / perpage)
      },
      data
    }
  },
  validateAndRespond: async function (model, req, res) {
    try {
      await model.validate()
      res.json(model.full(req.user))
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).json({ message: 'Validation failed.', validationerrors: convertMongoErrors(error.errors) })
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(409).json({ message: 'There was a concurrency conflict with your request. Perhaps another user was trying to take action at the same time on the same object.' })
        console.info('concurrency error', model.full(req.user))
      } else if (error.status) {
        res.status(error.status).json({ message: error.message })
      } else {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error(error)
      }
    }
  },
  hashToBinary: anybase(anybase.BIN, base64urlalphabet),
  binaryToHash: anybase(base64urlalphabet, anybase.BIN),
  scanVersion: 4
}

const fileType = require('file-type')
const fsp = require('fs').promises
const anybase = require('any-base')
const moment = require('moment-timezone')

const base64urlalphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

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
  hashToBinary: anybase(anybase.BIN, base64urlalphabet),
  binaryToHash: anybase(base64urlalphabet, anybase.BIN),
  scanVersion: 4
}

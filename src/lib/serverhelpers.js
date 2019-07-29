const _ = require('txstate-node-utils/lib/util')
const fileType = require('file-type')
const fsp = require('fs').promises

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
  }
}

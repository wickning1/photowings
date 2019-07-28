const moment = require('moment-timezone')
const _ = require('txstate-node-utils/lib/util')

module.exports = {
  nameToTitle: function (name) {
    if (!name) return ''
    return name.replace(/-_\./g, ' ').replace(/\w\S*/g, txt => (txt.substr(0, 1).toUpperCase() + txt.substr(1).toLowerCase()))
  },
  timeAgo: function (dt) {
    return moment(dt).fromNow()
  },
  absolute: function (req) {
    if (!_.isBlank(process.env.PUBLISHED_BASEURL)) return process.env.PUBLISHED_BASEURL.trim().replace(/\/$/, '')
    return req.protocol + '://' + req.get('host')
  },
  qs: function (url, params) {
    if (_.isEmpty(params)) return url
    const paramstrings = []
    for (const key of Object.keys(params)) {
      if (_.isArray(params[key])) {
        for (const val of params[key]) {
          paramstrings.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`)
        }
      } else if (!_.isBlank(params[key])) {
        paramstrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      }
    }
    return url + (paramstrings.length > 0 ? '?' + paramstrings.join('&') : '')
  },
  fetch: async function (ctx, url, params, options) {
    const address = this.qs(url, params)
    try {
      const res = await ctx.fetch(address, options)
      if (res.status < 200 || res.status > 299) ctx.error(res.status, res.statusText)
      else return res.json()
    } catch (e) {
      console.log(e)
      ctx.error(500, 'Unable to communicate with API.')
    }
  }
}

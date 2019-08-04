/* global history, location */
const moment = require('moment-timezone')
const _ = require('txstate-node-utils/lib/util')
const anybase = require('any-base')

const base64urlalphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

module.exports = {
  nameToTitle: function (name) {
    if (!name) return ''
    return name.replace(/-_\./g, ' ').replace(/\w\S*/g, txt => (txt.substr(0, 1).toUpperCase() + txt.substr(1).toLowerCase()))
  },
  timeAgo: function (dt) {
    return moment(dt).fromNow()
  },
  photoTime: function (dt) {
    return moment(dt).tz(this.defaultTZ).format('MMM D, YYYY @ ha')
  },
  defaultTZ: Intl ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/Chicago',
  absolute: function (req) {
    if (!_.isBlank(process.env.PUBLISHED_BASEURL)) return process.env.PUBLISHED_BASEURL.trim().replace(/\/$/, '')
    return req.protocol + '://' + req.get('host')
  },
  parampairs: function (params) {
    if (_.isEmpty(params)) return ''
    const paramstrings = []
    for (const key of Object.keys(params)) {
      if (Array.isArray(params[key])) {
        for (const val of params[key]) {
          paramstrings.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`)
        }
      } else if (!_.isBlank(params[key]) || params[key] > 0) {
        paramstrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      }
    }
    return paramstrings.join('&')
  },
  qs: function (url, params, sep = '?') {
    const pairstr = this.parampairs(params)
    return url + (pairstr ? sep + pairstr : '')
  },
  fetch: async function (ctx, url, params, options) {
    const address = this.qs(url, params)
    try {
      const res = await ctx.fetch(address, options)
      if (res.status < 200 || res.status > 299) ctx.error(res.status, res.statusText)
      else return res.json()
    } catch (e) {
      console.error(e)
      ctx.error(500, 'Unable to communicate with API.')
    }
  },
  apiResponse: function (count, data, perpage) {
    return {
      info: {
        finalpage: Math.ceil(count / perpage)
      },
      data
    }
  },
  detectClickOrEnter: function (e) {
    return e.type === 'click' || ['Enter', 'Space'].includes(e.key) || [13, 32].includes(e.keyCode)
  },
  a11yClick: function (handler) {
    return e => {
      if (this.detectClickOrEnter(e)) handler(e)
    }
  },
  replaceState: function (state) {
    const newstate = { ...this.state(), ...state }
    history.replaceState(newstate, '', location.search + this.qs('', newstate, '#'))
  },
  state: function () {
    return location.hash.slice(1).split('&').filter(p => p).map(p => (p.split('='))).reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})
  },
  hashToBinary: anybase(anybase.BIN, base64urlalphabet),
  binaryToHash: anybase(base64urlalphabet, anybase.BIN),
  scanVersion: 7
}

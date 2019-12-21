/* global history, location */
import _ from 'txstate-node-utils/lib/util'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { writable } from 'svelte/store'
import equal from 'fast-deep-equal'
dayjs.extend(customParseFormat)

export const defaultTZ = process && !process.env.TZ ? 'America/Chicago' : Intl.DateTimeFormat().resolvedOptions().timeZone

export function nameToTitle (name) {
  if (!name) return ''
  return name.replace(/-_\./g, ' ').replace(/\w\S*/g, txt => (txt.substr(0, 1).toUpperCase() + txt.substr(1).toLowerCase()))
}

export function toDayJs (dt) {
  return typeof dt === 'string' ? dayjs(dt, 'YYYY-MM-DDTH:m:sZ') : dayjs(dt)
}

export function photoTime (dt) {
  try {
    return toDayJs(dt).format('MMM D, YYYY @ ha')
  } catch (e) {
    return dt
  }
}

export function absolute (req) {
  if (!_.isBlank(process.env.PUBLISHED_BASEURL)) return process.env.PUBLISHED_BASEURL.trim().replace(/\/$/, '')
  return req.protocol + '://' + req.get('host')
}

export function parampairs (params, sep = '?') {
  if (_.isEmpty(params)) return ''
  const paramstrings = []
  for (const key of Object.keys(params)) {
    if (Array.isArray(params[key])) {
      for (const val of params[key]) {
        paramstrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      }
    } else if (params[key] === true && sep === '#') {
      paramstrings.push(encodeURIComponent(key))
    } else if (!_.isBlank(params[key]) || params[key] > 0) {
      paramstrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
  }
  return paramstrings.join('&')
}

export function qs (url, params, sep = '?') {
  const pairstr = parampairs(params, sep)
  return url + (pairstr ? sep + pairstr : '')
}

export async function fetch (ctx, url, params, options) {
  const address = qs(url, params)
  try {
    const res = await ctx.fetch(address, options)
    if (res.status < 200 || res.status > 299) ctx.error(res.status, res.statusText)
    else return res.json()
  } catch (e) {
    console.error(e)
    ctx.error(500, 'Unable to communicate with API.')
  }
}

export function replaceState (replace) {
  const newstate = { ...state(), ...replace }
  history.replaceState(newstate, '', location.search + qs('', newstate, '#'))
}

export function state () {
  return location.hash.slice(1).split('&').filter(p => p).map(p => (p.includes('=') ? p.split('=') : [p, true])).reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {})
}

export function aggressivederived (origin, cb) {
  const dest = writable(undefined)
  let current
  origin.subscribe(data => {
    const reduced = cb(data)
    if (!equal(reduced, current)) {
      current = reduced
      dest.set(reduced)
    }
  })
  return dest
}

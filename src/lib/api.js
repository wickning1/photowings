/* global fetch */
import * as helpers from './helpers'

function host () {
  return process.browser ? window.location.origin : 'http://localhost'
}

function normalizeUrl (url, params) {
  const obj = new URL(url, process.env.API_BASE || `${host()}/api/`)
  return helpers.qs(obj.toString(), params)
}

export async function get (url, params) {
  const resp = await fetch(normalizeUrl(url, params))
  return resp.json()
}

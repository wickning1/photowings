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
  const json = await resp.json()
  return json
}

// returns an errors object for smartforms.Form
export async function put (url, params, data) {
  const resp = await fetch(normalizeUrl(url, params), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (resp.status >= 500) throw new Error(resp.statusText)
  const json = await resp.json()
  return json && json.validationerrors ? json.validationerrors : {}
}

// returns an errors object for smartforms.Form
export async function post (url, params, data) {
  const resp = await fetch(normalizeUrl(url, params), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (resp.status >= 500) throw new Error(resp.statusText)
  const json = await resp.json()
  return json && json.validationerrors ? json.validationerrors : {}
}

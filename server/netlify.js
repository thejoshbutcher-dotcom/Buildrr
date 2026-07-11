// All Netlify API communication — OAuth token exchange and file-digest deploys.
// Runs server-side only so the client secret and the user's access token are
// never exposed to the browser.
import crypto from 'node:crypto'

const API = 'https://api.netlify.com/api/v1'
const AUTHORIZE = 'https://app.netlify.com/authorize'
const TOKEN_URL = 'https://api.netlify.com/oauth/token'

export function isConfigured() {
  return Boolean(process.env.NETLIFY_CLIENT_ID && process.env.NETLIFY_CLIENT_SECRET && process.env.NETLIFY_REDIRECT_URI)
}

export function authorizeUrl(state) {
  const p = new URLSearchParams({
    client_id: process.env.NETLIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.NETLIFY_REDIRECT_URI,
    state,
  })
  return `${AUTHORIZE}?${p}`
}

export async function exchangeCode(code) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.NETLIFY_CLIENT_ID,
      client_secret: process.env.NETLIFY_CLIENT_SECRET,
      redirect_uri: process.env.NETLIFY_REDIRECT_URI,
    }),
  })
  if (!res.ok) throw new Error(`Token exchange failed (${res.status}): ${await res.text()}`)
  const json = await res.json()
  if (!json.access_token) throw new Error('No access_token in Netlify response')
  return json.access_token
}

async function api(token, pathname, opts = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  })
  if (!res.ok) {
    const body = await res.text()
    const err = new Error(`Netlify ${opts.method || 'GET'} ${pathname} → ${res.status}: ${body}`)
    err.status = res.status
    throw err
  }
  return res.status === 204 ? null : res.json()
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// files: { "index.html": { data, encoding }, ... } where encoding is 'utf8'|'base64'.
// Returns { siteId, url }. Creates the site when siteId is falsy, otherwise
// deploys a new version to the existing site so its URL stays constant.
export async function deploy(token, siteId, files) {
  // 1. Turn each file into raw bytes + its SHA1 (what Netlify's digest wants).
  const entries = Object.entries(files).map(([path, { data, encoding }]) => {
    const buf = Buffer.from(data, encoding === 'base64' ? 'base64' : 'utf8')
    const key = '/' + path.replace(/^\/+/, '')
    return { key, path, buf, sha: crypto.createHash('sha1').update(buf).digest('hex') }
  })

  // 2. Ensure a site exists.
  let site
  if (siteId) {
    site = await api(token, `/sites/${siteId}`)
  } else {
    site = await api(token, '/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
  }

  // 2b. Netlify disables form detection by default on API-created sites, so
  // Netlify Forms in the deployed HTML are never registered (submissions 404).
  // Turn it on before deploying so this deploy gets scanned. Non-fatal.
  try {
    await api(token, `/sites/${site.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processing_settings: { ignore_html_forms: false } }),
    })
  } catch (e) {
    console.warn('Could not enable Netlify form detection:', e.message)
  }

  // 3. Open a deploy with the file digest.
  const digest = {}
  for (const e of entries) digest[e.key] = e.sha
  const dep = await api(token, `/sites/${site.id}/deploys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: digest }),
  })

  // 4. Upload every file Netlify says it still needs.
  const required = new Set(dep.required || [])
  for (const e of entries) {
    if (!required.has(e.sha)) continue
    await api(token, `/deploys/${dep.id}/files${e.key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: e.buf,
    })
  }

  // 5. Wait for the deploy to finish processing.
  let state = dep.state
  for (let i = 0; i < 40 && state !== 'ready' && state !== 'error'; i++) {
    await sleep(1500)
    const cur = await api(token, `/deploys/${dep.id}`)
    state = cur.state
  }
  if (state === 'error') throw new Error('Netlify reported a deploy error')

  const url = site.ssl_url || site.url || (site.subdomain ? `https://${site.subdomain}.netlify.app` : dep.ssl_url)
  return { siteId: site.id, url }
}

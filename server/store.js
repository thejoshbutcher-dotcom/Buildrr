// Minimal file-backed store mapping an opaque session id (held in an httpOnly
// cookie) to a Netlify OAuth token. Swap for a real DB/KV in a multi-instance
// deployment; for a single Node process on Hostinger this is enough. The token
// never leaves the server.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const FILE = process.env.BUILDRR_STORE || path.join(process.cwd(), '.data', 'sessions.json')

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {
    return {}
  }
}

function save(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data))
}

export function newSid() {
  return crypto.randomBytes(18).toString('hex')
}

export function getToken(sid) {
  if (!sid) return null
  return load()[sid]?.token || null
}

export function setToken(sid, token) {
  const data = load()
  data[sid] = { token, at: Date.now() }
  save(data)
}

export function clearToken(sid) {
  const data = load()
  delete data[sid]
  save(data)
}

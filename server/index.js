// Buildrr server: serves the static build AND the Netlify publish API.
// Run on Hostinger's Node.js app hosting. In dev, run alongside Vite (which
// proxies /api here — see vite.config.js).
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { newSid, getToken, setToken, clearToken } from './store.js'
import { isConfigured, authorizeUrl, exchangeCode, deploy } from './netlify.js'

// Load .env if present (no dependency; Node's --env-file is optional).
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
try {
  const envFile = path.join(root, '.env')
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
} catch {
  /* ignore */
}

const app = express()
const PORT = process.env.PORT || 8787
const prod = process.env.NODE_ENV === 'production'

app.use(express.json({ limit: '30mb' }))

// -- tiny cookie helpers (no cookie-parser dependency) --
function readSid(req) {
  const raw = req.headers.cookie || ''
  const m = raw.match(/(?:^|;\s*)buildrr_sid=([^;]+)/)
  return m ? m[1] : null
}
function ensureSid(req, res) {
  let sid = readSid(req)
  if (!sid) {
    sid = newSid()
    res.setHeader('Set-Cookie', `buildrr_sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${prod ? '; Secure' : ''}`)
  }
  return sid
}

// -- API --
app.get('/api/netlify/config', (req, res) => {
  res.json({ configured: isConfigured() })
})

app.get('/api/netlify/status', (req, res) => {
  const sid = readSid(req)
  res.json({ configured: isConfigured(), connected: Boolean(getToken(sid)) })
})

// Popup opens this; we bounce to Netlify's OAuth consent screen.
app.get('/api/netlify/connect', (req, res) => {
  if (!isConfigured()) return res.status(503).send('Netlify integration is not configured on this server.')
  const sid = ensureSid(req, res)
  res.redirect(authorizeUrl(sid)) // state = sid, verified on callback
})

// Netlify redirects the popup back here with ?code&state.
app.get('/api/netlify/callback', async (req, res) => {
  const sid = readSid(req)
  const { code, state, error } = req.query
  const close = (msg, ok) =>
    res.send(`<!doctype html><meta charset="utf-8"><body style="font:15px system-ui;padding:24px;color:#171921">
<p>${msg}</p><script>
try { window.opener && window.opener.postMessage({ buildrr_netlify: ${ok ? "'connected'" : "'error'"} }, '*') } catch (e) {}
setTimeout(function(){ window.close() }, ${ok ? 300 : 2500})
</script></body>`)
  if (error) return close(`Netlify authorization was cancelled.`, false)
  if (!code || !state || state !== sid) return close('Authorization failed (session mismatch). Please try again.', false)
  try {
    setToken(sid, await exchangeCode(code))
    close('Connected to Netlify. You can close this window.', true)
  } catch (e) {
    console.error(e)
    close('Could not complete the Netlify connection. Please try again.', false)
  }
})

app.post('/api/netlify/disconnect', (req, res) => {
  clearToken(readSid(req))
  res.json({ ok: true })
})

// Deploy the exported site. Body: { siteId?, files: { path: { data, encoding } } }.
app.post('/api/netlify/deploy', async (req, res) => {
  const token = getToken(readSid(req))
  if (!token) return res.status(401).json({ error: 'not_connected' })
  const { siteId, files } = req.body || {}
  if (!files || typeof files !== 'object') return res.status(400).json({ error: 'no_files' })
  try {
    const result = await deploy(token, siteId || null, files)
    res.json(result)
  } catch (e) {
    console.error(e)
    // A 401 means the stored token is stale — force a reconnect.
    if (e.status === 401) {
      clearToken(readSid(req))
      return res.status(401).json({ error: 'not_connected' })
    }
    res.status(502).json({ error: 'deploy_failed', message: String(e.message || e) })
  }
})

// -- static site + SPA fallback --
const dist = path.join(root, 'dist')
const indexHtml = path.join(dist, 'index.html')
if (!fs.existsSync(indexHtml)) {
  console.warn('WARNING: dist/index.html not found — run `npm run build`. Serving a placeholder until then.')
}

app.use(express.static(dist, { index: false }))
app.get('*', (req, res) => {
  if (fs.existsSync(indexHtml)) return res.sendFile(indexHtml)
  res.status(503).type('text').send('Buildrr is starting — the frontend build (dist/) is missing. Run `npm run build`.')
})

// Bind immediately so the host's health check succeeds right away. Never block
// startup (a slow synchronous task here can trip a 503 from the platform proxy).
const server = app.listen(PORT, () => {
  console.log(`Buildrr server listening on :${PORT}  (Netlify ${isConfigured() ? 'configured' : 'NOT configured'})`)
})
server.on('error', (e) => console.error('Server failed to start:', e.message))

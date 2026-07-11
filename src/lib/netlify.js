// Frontend client for the Netlify publish API. Every call is same-origin to
// the Buildrr server (dev: proxied by Vite). No tokens or secrets touch the
// browser — the server holds them.
import { assembleSite } from './export.js'

async function j(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || data.error || `Request failed (${res.status})`)
    err.code = data.error
    err.status = res.status
    throw err
  }
  return data
}

// Reachable + whether the OAuth app credentials are set on the server.
// Returns { available, configured, connected }. `available:false` means the
// Node server isn't running (e.g. a static-only deploy) — fall back to manual.
export async function netlifyStatus() {
  try {
    const res = await fetch('/api/netlify/status', { headers: { Accept: 'application/json' } })
    if (!res.ok) return { available: true, configured: false, connected: false }
    const data = await res.json()
    return { available: true, ...data }
  } catch {
    return { available: false, configured: false, connected: false }
  }
}

// Opens the Netlify OAuth consent popup and resolves once it reports back.
export function connectNetlify() {
  return new Promise((resolve, reject) => {
    const w = 620
    const h = 720
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2
    const popup = window.open('/api/netlify/connect', 'buildrr-netlify', `width=${w},height=${h},top=${y},left=${x}`)
    if (!popup) return reject(new Error('Popup blocked — allow popups for this site and try again.'))
    const onMsg = (e) => {
      if (!e.data || !e.data.buildrr_netlify) return
      cleanup()
      e.data.buildrr_netlify === 'connected' ? resolve(true) : reject(new Error('Netlify connection was cancelled.'))
    }
    const timer = setInterval(() => {
      if (popup.closed) {
        cleanup()
        reject(new Error('Connection window closed before finishing.'))
      }
    }, 500)
    function cleanup() {
      clearInterval(timer)
      window.removeEventListener('message', onMsg)
      try {
        popup.close()
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('message', onMsg)
  })
}

export async function disconnectNetlify() {
  await fetch('/api/netlify/disconnect', { method: 'POST' })
}

// Deploy the current project. Reuses the exact export pipeline (assembleSite),
// so the deployed output is byte-identical to the ZIP/manual output.
// Returns { siteId, url }.
export async function publishToNetlify(config, siteId) {
  const { files } = assembleSite(config)
  const res = await fetch('/api/netlify/deploy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteId: siteId || null, files }),
  })
  return j(res)
}

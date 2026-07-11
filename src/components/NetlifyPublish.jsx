import React from 'react'
import { netlifyStatus, connectNetlify, disconnectNetlify, publishToNetlify } from '../lib/netlify.js'

// One-click publish to the user's own Netlify account. Falls back to the manual
// drag-and-drop instructions when the server/OAuth app isn't available.
export default function NetlifyPublish({ config, siteId, url, onSaved }) {
  const [st, setSt] = React.useState({ available: false, configured: false, connected: false, loading: true })
  const [phase, setPhase] = React.useState('idle') // idle | connecting | deploying | error
  const [error, setError] = React.useState('')
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let live = true
    netlifyStatus().then((s) => live && setSt({ ...s, loading: false }))
    return () => {
      live = false
    }
  }, [])

  const deploy = async () => {
    setError('')
    setPhase('deploying')
    try {
      const { siteId: id, url: liveUrl } = await publishToNetlify(config, siteId)
      onSaved(id, liveUrl)
      setPhase('idle')
    } catch (e) {
      if (e.code === 'not_connected') {
        setSt((s) => ({ ...s, connected: false }))
        setError('Your Netlify connection expired — connect again to publish.')
      } else {
        setError(e.message || 'Deploy failed. Please try again.')
      }
      setPhase('error')
    }
  }

  const publish = async () => {
    setError('')
    if (st.connected) return deploy()
    setPhase('connecting')
    try {
      await connectNetlify()
      setSt((s) => ({ ...s, connected: true }))
      await deploy() // continue straight into deploy, no extra click
    } catch (e) {
      setError(e.message || 'Could not connect to Netlify.')
      setPhase('error')
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  if (st.loading) return <div className="deploy-primary np-loading">Checking publish options…</div>

  // Server or OAuth app not set up → keep the manual path as the primary option.
  if (!st.available || !st.configured) {
    return (
      <div className="deploy-primary">
        <b>Netlify Drop — easiest</b>
        <ol>
          <li>Click “Export site” above and unzip the download.</li>
          <li>Open app.netlify.com/drop and drag the unzipped folder onto it.</li>
          <li>You get a live HTTPS link in seconds. Add a custom domain any time in Site settings.</li>
        </ol>
        {st.available && !st.configured && (
          <div className="np-note">One-click publishing isn’t enabled on this server yet. See the setup note in the README.</div>
        )}
      </div>
    )
  }

  const busy = phase === 'connecting' || phase === 'deploying'
  const label =
    phase === 'connecting' ? 'Connecting to Netlify…' : phase === 'deploying' ? 'Publishing…' : st.connected ? '⚡ Publish to Netlify' : 'Connect Netlify & publish'

  return (
    <div className="np">
      <button className="btn-primary np-btn" onClick={publish} disabled={busy}>
        {busy && <span className="np-spin" aria-hidden="true" />}
        {label}
      </button>

      {phase === 'deploying' && <div className="np-note">Uploading your site to Netlify — this usually takes 10–20 seconds.</div>}

      {url && phase !== 'deploying' && (
        <div className="np-live">
          <div className="np-live-top">
            <span className="np-dot" /> Live at
          </div>
          <a className="np-url" href={url} target="_blank" rel="noreferrer">
            {url.replace(/^https?:\/\//, '')}
          </a>
          <div className="np-actions">
            <button className="img-btn" onClick={copy}>
              {copied ? 'Copied ✓' : 'Copy URL'}
            </button>
            <a className="img-btn" href={url} target="_blank" rel="noreferrer">
              Open website ↗
            </a>
            <button className="np-republish" onClick={deploy} disabled={busy}>
              Republish
            </button>
          </div>
        </div>
      )}

      {error && <div className="publish-status warn">{error}</div>}

      {st.connected && (
        <button
          className="np-disconnect"
          onClick={async () => {
            await disconnectNetlify()
            setSt((s) => ({ ...s, connected: false }))
          }}
        >
          Disconnect Netlify
        </button>
      )}
    </div>
  )
}

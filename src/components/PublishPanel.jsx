import React from 'react'
import NetlifyPublish from './NetlifyPublish.jsx'
import { exportSingleHtml, copySingleHtml } from '../lib/export.js'

// Per-destination editor config: which extra input to show, its placeholder,
// where to find the value, and what happens to the visitor after they submit.
const DESTINATIONS = {
  thanks: {
    label: 'Thank-you page only (no email tool yet)',
    field: null,
    status: 'Signups just go to your thank-you page. Pick a destination below to start collecting emails.',
    tone: 'neutral',
  },
  netlify: {
    label: 'Netlify Forms (zero setup)',
    field: null,
    hint: 'Nothing to paste. Deploy to Netlify (below) and submissions appear in your Netlify dashboard — turn on email alerts there.',
    status: 'Visitors stay on your own thank-you page. Works only when you deploy to Netlify.',
    tone: 'good',
  },
  kit: {
    label: 'ConvertKit / Kit',
    field: 'actionUrl',
    placeholder: 'https://app.kit.com/forms/000000/subscriptions',
    hint: 'In Kit: Grow → Landing Pages & Forms → your form → Embed → HTML. Copy the form’s action URL (ends in /subscriptions).',
    status: 'Visitors stay on your own thank-you page.',
    tone: 'good',
  },
  mailchimp: {
    label: 'Mailchimp',
    field: 'actionUrl',
    placeholder: 'https://xxxx.us1.list-manage.com/subscribe/post?u=…&id=…',
    hint: 'In Mailchimp: Audience → Signup forms → Embedded form. Copy the URL inside the form’s action="…".',
    status: 'Mailchimp shows its own “almost finished” confirmation page after signup.',
    tone: 'warn',
  },
  mailerlite: {
    label: 'MailerLite',
    field: 'actionUrl',
    placeholder: 'https://assets.mailerlite.com/jsonp/…/subscribe',
    hint: 'Use a MailerLite embedded (HTML) form and copy its action URL. If your account only offers a JavaScript embed, use FormSubmit or Custom instead.',
    status: 'MailerLite shows its own confirmation page after signup.',
    tone: 'warn',
  },
  formsubmit: {
    label: 'FormSubmit (email me each signup — no account)',
    field: 'email',
    placeholder: 'you@example.com',
    hint: 'No signup. Enter your email; the first submission sends a one-time confirmation link you click once to activate.',
    status: 'Visitors stay on your own thank-you page.',
    tone: 'good',
  },
  custom: {
    label: 'Custom endpoint',
    field: 'actionUrl',
    placeholder: 'https://…',
    hint: 'Any URL that accepts a POST (Formspree, Basin, your own API…).',
    status: null,
    tone: 'neutral',
  },
}

const STEP_GROUPS = [
  {
    name: 'Vercel',
    steps: ['Run “npx vercel” inside the unzipped folder, or drag it into the Vercel dashboard.'],
  },
  {
    name: 'Cloudflare Pages',
    steps: ['Create a new Pages project and upload the unzipped folder — no build command needed.'],
  },
  {
    name: 'GitHub Pages',
    steps: ['Push the files to a repo, then enable Pages under Settings → Pages (branch: main, folder: /root).'],
  },
  {
    name: 'Classic host (cPanel / FTP)',
    steps: ['Upload everything in the folder to public_html (or your web root). No server config needed.'],
  },
]

function CaptureEditor({ capture, setCapture, formLabel }) {
  const dest = DESTINATIONS[capture.destination] || DESTINATIONS.thanks
  return (
    <div>
      <p className="publish-lead">{formLabel}</p>
      <div className="f">
        <label htmlFor="cap-dest">Send signups to</label>
        <select id="cap-dest" value={capture.destination} onChange={(e) => setCapture({ destination: e.target.value })}>
          {Object.entries(DESTINATIONS).map(([id, d]) => (
            <option key={id} value={id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {dest.field === 'actionUrl' && (
        <div className="f">
          <label htmlFor="cap-url">Form URL</label>
          <input id="cap-url" type="url" placeholder={dest.placeholder} value={capture.actionUrl} onChange={(e) => setCapture({ actionUrl: e.target.value })} />
        </div>
      )}
      {dest.field === 'email' && (
        <div className="f">
          <label htmlFor="cap-email">Your email</label>
          <input id="cap-email" type="email" placeholder={dest.placeholder} value={capture.email} onChange={(e) => setCapture({ email: e.target.value })} />
        </div>
      )}

      {capture.destination === 'custom' && (
        <div className="toggle-row">
          <label htmlFor="cap-ajax">Submit in the background (stay on my thank-you page)</label>
          <span className="switch">
            <input id="cap-ajax" type="checkbox" checked={!!capture.customAjax} onChange={(e) => setCapture({ customAjax: e.target.checked })} />
            <span className="track" />
          </span>
        </div>
      )}

      {dest.hint && <div className="publish-hint">{dest.hint}</div>}
      {dest.status && <div className={`publish-status ${dest.tone}`}>{dest.status}</div>}
    </div>
  )
}

// Sales pages sell through a checkout link instead of an email form.
// Edits the same offer.checkoutUrl the Offer section uses — one value, two doors.
function CheckoutEditor({ content, update, highlight }) {
  const checkout = (content.offer.checkoutUrl || '').trim()
  const direct = !!content.settings.directCta
  const fieldRef = React.useRef(null)

  // An unconfigured buy button was clicked in the preview: point right at the
  // checkout field.
  React.useEffect(() => {
    if (!highlight || !fieldRef.current) return
    const wrap = fieldRef.current
    wrap.scrollIntoView({ block: 'center', behavior: 'smooth' })
    wrap.querySelector('input')?.focus()
    wrap.classList.add('flash-field')
    const t = setTimeout(() => wrap.classList.remove('flash-field'), 1800)
    return () => clearTimeout(t)
  }, [highlight])

  return (
    <div>
      <p className="publish-lead">Where your buy buttons send people.</p>
      <div className="f" ref={fieldRef}>
        <label htmlFor="cta-url">Checkout link</label>
        <input
          id="cta-url"
          type="url"
          placeholder="https://buy.stripe.com/…"
          value={content.offer.checkoutUrl || ''}
          onChange={(e) => update('offer.checkoutUrl', e.target.value)}
        />
        <div className="help">Stripe payment link, ThriveCart, SamCart, Gumroad… (also editable in the Offer stack &amp; price section).</div>
      </div>
      <div className="toggle-row">
        <label htmlFor="cta-direct">Buttons go straight to checkout</label>
        <span className="switch">
          <input id="cta-direct" type="checkbox" checked={direct} onChange={(e) => update('settings.directCta', e.target.checked)} />
          <span className="track" />
        </span>
      </div>
      <div className="publish-hint">
        Off: the hero and closing buttons scroll to your offer box so people see the full stack before buying. On: every buy button opens
        your checkout link directly.
      </div>
      {checkout ? (
        <div className="publish-status good">
          {direct ? 'All buy buttons open your checkout link.' : 'Buttons pitch the offer first; its buy button opens your checkout link.'}
        </div>
      ) : (
        <div className="publish-status warn">No checkout link yet — buttons scroll to the offer, but its buy button goes nowhere.</div>
      )}
    </div>
  )
}

function SingleHtmlExport({ config, toast }) {
  const [copied, setCopied] = React.useState(false)
  const onCopy = async () => {
    try {
      const len = await copySingleHtml(config)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
      toast?.(`Copied ${(len / 1024).toFixed(0)} KB of HTML — paste into one custom-HTML block`)
    } catch {
      toast?.('Couldn’t copy — use “Download .html” instead')
    }
  }
  return (
    <details className="group deploy-alt">
      <summary>Single HTML file (GHL, funnels…)</summary>
      <div className="group-body">
        <div className="publish-hint" style={{ marginTop: 0 }}>
          One self-contained .html — all CSS, JS, and images inlined. Paste it into a single custom-HTML block in GoHighLevel, ClickFunnels,
          Webflow, etc. Best for a single page (multi-page sites export the home page).
        </div>
        <div className="np-actions" style={{ marginTop: 10 }}>
          <button className="img-btn" onClick={onCopy}>
            {copied ? 'Copied ✓' : 'Copy HTML'}
          </button>
          <button className="img-btn" onClick={() => exportSingleHtml(config)}>
            Download .html
          </button>
        </div>
      </div>
    </details>
  )
}

export default function PublishPanel({ pageType, capture, setCapture, content, update, config, publish, setPublish, onExport, toast, checkoutHighlight }) {
  return (
    <div>
      <div className="design-label">{pageType === 'sales' ? 'Take payment' : 'Collect emails'}</div>
      {pageType === 'sales' ? (
        <CheckoutEditor content={content} update={update} highlight={checkoutHighlight} />
      ) : (
        <CaptureEditor
          capture={capture}
          setCapture={setCapture}
          formLabel={pageType === 'optin' ? 'Where your opt-in form sends new subscribers.' : 'Where your contact form sends each message.'}
        />
      )}

      <div className="design-label" style={{ marginTop: 26 }}>Publish</div>
      <NetlifyPublish config={config} siteId={publish?.netlifySiteId} url={publish?.netlifyUrl} onSaved={(netlifySiteId, netlifyUrl) => setPublish({ netlifySiteId, netlifyUrl })} />

      <div className="design-label" style={{ marginTop: 22 }}>Or export the files</div>
      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }} onClick={onExport}>
        ⤓ Export site (.zip)
      </button>
      <SingleHtmlExport config={config} toast={toast} />
      {STEP_GROUPS.map((g) => (
        <details className="group deploy-alt" key={g.name}>
          <summary>{g.name}</summary>
          <div className="group-body">
            <ol className="deploy-steps">
              {g.steps.map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ol>
          </div>
        </details>
      ))}
    </div>
  )
}

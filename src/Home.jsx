import React from 'react'

const Logo = () => (
  <span className="logo-mark" aria-hidden="true">
    <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff">
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <rect x="6" y="4" width="12" height="7" rx="2" opacity="0.8" />
    </svg>
  </span>
)

const STEPS = [
  {
    title: 'Pick your page',
    text: 'Opt-in page, sales page with VSL, or a multi-page mini-site — conversion-tested layouts with real copy already in place, not empty boxes.',
  },
  {
    title: 'Make it yours',
    text: 'Click any text on the page and type. Swap design styles, drag sections around, add images and backgrounds, set your two brand colors.',
  },
  {
    title: 'Export & go live',
    text: 'Download a tiny folder of clean HTML, CSS, and JS. Drag it onto Netlify and you’re live — with forms already wired to your email tool.',
  },
]

// Each feature card carries a looping mini-demo of the real interaction; it
// plays on hover (or keyboard focus), like a GIF of the feature in action.
const DEMOS = {
  looks: (
    <div className="demo demo-looks" aria-hidden="true">
      <div className="dl-page dl-a">
        <b>Aa</b>
        <span className="dl-line w70" />
        <span className="dl-line w50" />
        <span className="dl-btn" />
      </div>
      <div className="dl-page dl-b">
        <b>AA</b>
        <span className="dl-line w70" />
        <span className="dl-line w50" />
        <span className="dl-btn" />
      </div>
      <div className="dl-page dl-c">
        <b>Aa</b>
        <span className="dl-line w70" />
        <span className="dl-line w50" />
        <span className="dl-btn" />
      </div>
      <div className="dl-dots">
        <i /> <i /> <i />
      </div>
    </div>
  ),
  sections: (
    <div className="demo demo-sections" aria-hidden="true">
      <div className="ds-row"><span className="ds-grip" /><span className="ds-bar w60" /><span className="ds-ico" /></div>
      <div className="ds-row ds-move"><span className="ds-grip" /><span className="ds-bar w45 acc" /><span className="ds-ico" /></div>
      <div className="ds-row ds-swap"><span className="ds-grip" /><span className="ds-bar w70" /><span className="ds-ico" /></div>
      <div className="ds-row"><span className="ds-grip" /><span className="ds-bar w55" /><span className="ds-ico blink" /></div>
    </div>
  ),
  edit: (
    <div className="demo demo-edit" aria-hidden="true">
      <div className="de-line">
        Ship it&nbsp;
        <span className="de-w">
          <b className="w1">faster.</b>
          <b className="w2">today.</b>
          <i className="de-caret" />
        </span>
      </div>
      <span className="de-tag">editing live</span>
    </div>
  ),
  capture: (
    <div className="demo demo-capture" aria-hidden="true">
      <div className="dc-input"><span /></div>
      <div className="dc-select">
        <span className="dc-opts">
          <span className="dc-opt o1">ConvertKit</span>
          <span className="dc-opt o2">Mailchimp</span>
          <span className="dc-opt o3">Netlify Forms</span>
        </span>
        <span className="dc-chev">▾</span>
      </div>
      <div className="dc-ok">✓ field names wired</div>
    </div>
  ),
  weight: (
    <div className="demo demo-weight" aria-hidden="true">
      <div className="dw-row">
        <span className="dw-label">Typical builder</span>
        <span className="dw-track"><i className="dw-fill dw-heavy" /></span>
        <span className="dw-size">2.4 MB</span>
      </div>
      <div className="dw-row">
        <span className="dw-label">Buildrr</span>
        <span className="dw-track"><i className="dw-fill dw-light" /></span>
        <span className="dw-size dw-win">36 KB ⚡</span>
      </div>
    </div>
  ),
  yours: (
    <div className="demo demo-yours" aria-hidden="true">
      <span className="dy-zip">.zip</span>
      <span className="dy-file" />
      <span className="dy-host h1">Netlify</span>
      <span className="dy-host h2">Vercel</span>
      <span className="dy-host h3">cPanel</span>
    </div>
  ),
}

const FEATURES = [
  { demo: 'looks', title: 'Three unique themes', text: 'Editorial, Impact, and Lumen — three distinct looks, plus fully customizable colors and fonts to match your brand.' },
  { demo: 'sections', title: 'Sections that snap', text: 'Drag to reorder, hide what you don’t need, and pull extras — FAQs, testimonials, video, images — from the add-on library.' },
  { demo: 'edit', title: 'Edit on the page', text: 'No forms-on-the-left guesswork. Click the headline, type the headline. What you see is literally what ships.' },
  { demo: 'capture', title: 'Email capture, wired', text: 'ConvertKit, Mailchimp, MailerLite, FormSubmit, or Netlify Forms — with the exact field names each one needs.' },
  { demo: 'weight', title: 'Featherweight output', text: 'A full sales page weighs about as much as one Instagram photo. Vanilla JS, tasteful scroll reveals, instant loads.' },
  { demo: 'yours', title: 'Yours forever', text: 'You leave with files, not a subscription. Host them anywhere, edit them in anything, owe nobody a monthly fee.' },
]

// Character-by-character typewriter with human-ish keystroke timing.
// `editing` is true while deleting/retyping — it drives the edit ring and the
// sidebar card flash, synced to the real typing instead of a timed guess.
function useTypewriter(words) {
  const [text, setText] = React.useState(words[0])
  const [editing, setEditing] = React.useState(false)
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timer
    let word = 0
    const schedule = (fn, ms) => {
      timer = setTimeout(fn, ms)
    }
    const erase = (s) => {
      if (s.length > 0) {
        setText(s.slice(0, -1))
        schedule(() => erase(s.slice(0, -1)), 40)
      } else {
        word = (word + 1) % words.length
        schedule(() => type(words[word], 1), 380)
      }
    }
    const type = (target, i) => {
      setText(target.slice(0, i))
      if (i < target.length) {
        schedule(() => type(target, i + 1), 70 + Math.random() * 60)
      } else {
        setEditing(false)
        schedule(() => {
          setEditing(true)
          erase(target)
        }, 2800)
      }
    }
    schedule(() => {
      setEditing(true)
      erase(words[0])
    }, 3200)
    return () => clearTimeout(timer)
  }, [words])
  return { text, editing }
}

const HERO_WORDS = ['course.', 'podcast.', 'studio.']

export default function Home({ onOpen }) {
  const { text: heroWord, editing } = useTypewriter(HERO_WORDS)
  const open = (e) => {
    e.preventDefault()
    onOpen()
  }
  return (
    <div className="mkt">
      <header className="mkt-nav">
        <div className="mkt-wrap mkt-nav-inner">
          <span className="logo">
            <Logo /> Buildrr
          </span>
          <a className="btn-primary" href="/app" onClick={open}>
            Open Buildrr
          </a>
        </div>
      </header>

      <main>
        <section className="mkt-hero">
          <div className="mkt-wrap mkt-hero-grid">
            <div>
              <span className="mkt-chip">Free · No account · Nothing to install</span>
              <h1>
                From idea to <em>live</em> in minutes.
              </h1>
              <p className="mkt-lead">
                Buildrr is a landing page builder for people who’d rather ship than fiddle: proven layouts with real copy, click-to-edit
                everything, your brand in two color picks — then export clean HTML and put it anywhere.
              </p>
              <div className="mkt-cta-row">
                <a className="btn-primary big" href="/app" onClick={open}>
                  Open Buildrr →
                </a>
                <a
                  className="mkt-ghost"
                  href="#how"
                  onClick={(e) => {
                    e.preventDefault()
                    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    document.getElementById('how')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
                  }}
                >
                  See how it works
                </a>
              </div>
            </div>

            <div className="mkt-mock" aria-hidden="true">
              <div className="mock-browser">
                <div className="mock-bar">
                  <i /> <i /> <i />
                </div>
                {/* Miniature of the real builder: topbar, section sidebar, live preview */}
                <div className="ma">
                  <div className="ma-top">
                    <span className="ma-logo" />
                    <span className="ma-tabs">
                      <i className="on">Opt-in</i>
                      <i>Sales</i>
                      <i>Site</i>
                    </span>
                    <span className="ma-export">
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M3 12h18" />
                        <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z" />
                      </svg>
                      Publish
                    </span>
                  </div>
                  <div className="ma-body">
                    <div className="ma-side">
                      <div className={`ma-card ma-c1 ma-hero-card ${editing ? 'live' : ''}`}><s /> Hero + form</div>
                      <div className="ma-card ma-c2"><s /> Proof bar</div>
                      <div className="ma-card ma-c3"><s /> What you’ll learn</div>
                      <div className="ma-add ma-c4">+ Add section</div>
                    </div>
                    <div className="ma-canvas">
                      <div className="mp mp-nav">
                        <b>Brightline</b>
                        <i />
                      </div>
                      <div className="mp mp-hero">
                        <div className="mp-copy">
                          <div className={`mp-head ${editing ? 'editing' : ''}`}>
                            Launch your{' '}
                            <span className="mp-w">
                              <b className="mw">{heroWord}</b>
                              <i className="mp-caret" />
                            </span>
                          </div>
                          <span className="mp-line l1" />
                          <span className="mp-line l2" />
                          <span className="mp-btn" />
                        </div>
                        <div className="mp-form">
                          <span className="mp-field" />
                          <span className="mp-field" />
                          <span className="mp-fbtn" />
                        </div>
                      </div>
                      <div className="mp mp-proof">
                        <i /> <i /> <i />
                      </div>
                      <div className="mp mp-cards">
                        <i /> <i /> <i />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mkt-how" id="how">
          <div className="mkt-wrap">
            <h2>Three steps. That’s the whole tool.</h2>
            <div className="mkt-steps">
              {STEPS.map((s, i) => (
                <div className="mkt-step" key={s.title}>
                  <span className="mkt-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mkt-features">
          <div className="mkt-wrap">
            <h2>Everything you need. Nothing to babysit.</h2>
            <div className="mkt-grid">
              {FEATURES.map((f) => (
                <div className="mkt-card has-demo" key={f.title} tabIndex={0}>
                  <div className="mkt-demo">
                    {DEMOS[f.demo]}
                    <span className="demo-hint">▶</span>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mkt-why">
          <div className="mkt-wrap mkt-why-inner">
            <div>
              <h2>Why not just use a website builder?</h2>
              <p>
                Platforms rent you your own page — miss a payment and it vanishes. Buildrr hands you the files. Launch the idea, keep the
                page, pay no one.
              </p>
            </div>
            <ul className="mkt-checks">
              <li>No monthly fee</li>
              <li>No account or sign-up</li>
              <li>No lock-in — plain HTML/CSS/JS</li>
            </ul>
          </div>
        </section>

        <section className="mkt-final">
          <div className="mkt-wrap">
            <h2>The internet has room for your idea.</h2>
            <p>Open Buildrr, pick a page, and be live before you talk yourself out of it.</p>
            <a className="mkt-final-btn" href="/app" onClick={open}>
              Open Buildrr — free
            </a>
            <span className="mkt-final-note">Runs entirely in your browser. Your work autosaves locally.</span>
          </div>
        </section>
      </main>

      <footer className="mkt-footer">
        <div className="mkt-wrap mkt-footer-inner">
          <span className="logo">
            <Logo /> Buildrr
          </span>
          <span>Landing pages without the platform.</span>
          <span>© {new Date().getFullYear()} Buildrr</span>
        </div>
      </footer>
    </div>
  )
}

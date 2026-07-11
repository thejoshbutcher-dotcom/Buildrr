// The three design skins. A skin owns typography, shape language, and section
// treatments; brand colors and tone thread through the shared token variables.

export const headlineFonts = {
  default: { label: 'Skin default', family: null, param: null },
  fraunces: { label: 'Fraunces (elegant serif)', family: "'Fraunces', serif", param: 'Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700' },
  archivo: { label: 'Archivo (bold grotesk)', family: "'Archivo', sans-serif", param: 'Archivo:wght@700;800;900' },
  jakarta: { label: 'Plus Jakarta Sans (friendly)', family: "'Plus Jakarta Sans', sans-serif", param: 'Plus+Jakarta+Sans:wght@700;800' },
  space: { label: 'Space Grotesk (techy)', family: "'Space Grotesk', sans-serif", param: 'Space+Grotesk:wght@500;700' },
  playfair: { label: 'Playfair Display (classic)', family: "'Playfair Display', serif", param: 'Playfair+Display:wght@600;700;800' },
  bricolage: { label: 'Bricolage Grotesque (editorial)', family: "'Bricolage Grotesque', sans-serif", param: 'Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800' },
}

export const skins = {
  editorial: {
    name: 'Editorial',
    blurb: 'Premium personal-brand look — refined serif headlines, marker highlights, quiet confidence.',
    fonts: {
      display: "'Fraunces', serif",
      body: "'Instrument Sans', sans-serif",
      params: ['Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700', 'Instrument+Sans:wght@400;500;600;700'],
      displayWeight: 600,
      tracking: '-0.015em',
    },
    css: `
:root { --btn-radius: 8px; --card-radius: 14px; --card-shadow: none; }
body { font-size: 17.5px; }
h1, h2, h3, h4 { font-variation-settings: "opsz" 90; }
.hero h1 { line-height: 1.04; }
.hl {
  font-style: normal;
  background: linear-gradient(transparent 62%, var(--accent-soft) 62%);
  padding-inline: 2px;
}
.eyebrow { display: inline-flex; align-items: center; gap: 10px; }
.eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--accent); }
.btn { letter-spacing: 0.01em; }
.btn:hover { box-shadow: 0 14px 30px -14px color-mix(in oklab, var(--brand) 70%, transparent); }
.card { box-shadow: none; }
.card h3 { font-family: var(--font-body); font-weight: 700; letter-spacing: 0; }
.quote-card blockquote { font-family: var(--font-display); font-size: 19px; line-height: 1.5; font-weight: 500; }
.quote-card blockquote::before { content: "\\201C"; display: block; font-size: 52px; line-height: 0.6; color: var(--accent); margin-bottom: 14px; }
.stars { display: none; }
.step::before { font-size: 40px; color: color-mix(in oklab, var(--ink) 16%, transparent); }
.form-card { box-shadow: 0 24px 60px -30px rgb(0 0 0 / 0.28); }
.proof { border-block-style: solid; }
.faq summary { font-family: var(--font-display); font-weight: 600; font-size: 18px; }
.cta-band .hl { background: linear-gradient(transparent 62%, color-mix(in oklab, var(--on-brand) 32%, transparent) 62%); }
`,
  },

  impact: {
    name: 'Impact',
    blurb: 'High-energy launch look — big block type, thick borders, punchy offset shadows.',
    fonts: {
      display: "'Archivo', sans-serif",
      body: "'Archivo', sans-serif",
      params: ['Archivo:wght@400;600;800;900'],
      displayWeight: 900,
      tracking: '-0.01em',
    },
    css: `
:root {
  --btn-radius: 12px;
  --card-radius: 16px;
  --edge: color-mix(in oklab, var(--ink) 88%, transparent);
  --card-shadow: none;
}
h1, h2 { text-transform: uppercase; line-height: 0.98; }
.hero h1 { font-size: clamp(42px, 6.6vw, 78px); }
.hl { font-style: normal; color: var(--on-accent); background: var(--accent); padding: 0 10px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.eyebrow {
  background: var(--ink); color: var(--bg);
  padding: 7px 14px; border-radius: 999px;
  font-size: 12.5px; letter-spacing: 0.16em;
}
.btn {
  border: 2.5px solid var(--edge);
  box-shadow: 5px 5px 0 var(--edge);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 16px;
}
.btn:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--edge); }
.btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--edge); }
.btn.ghost { box-shadow: 5px 5px 0 var(--edge); background: var(--bg); }
.card, .form-card, .offer-box, .faq details, .guarantee {
  border: 2.5px solid var(--edge);
  box-shadow: 7px 7px 0 var(--edge);
}
.guarantee { border-style: solid; }
.card-icon { border: 2px solid var(--edge); }
.proof { border-block: 2.5px solid var(--edge); background: var(--accent); }
.proof-item { color: var(--on-accent); font-weight: 800; text-transform: uppercase; font-size: 13.5px; letter-spacing: 0.05em; }
.proof-item svg { color: var(--on-accent); }
.check { border-radius: 8px; }
.avatar { border: 2px solid var(--edge); border-radius: 12px; }
.step::before {
  background: var(--brand); color: var(--on-brand);
  width: 44px; height: 44px; display: grid; place-items: center;
  border-radius: 10px; border: 2px solid var(--edge);
  box-shadow: 4px 4px 0 var(--edge);
  font-size: 16px;
}
.offer-head { border-bottom: 2.5px solid var(--edge); }
.offer-cta { border-top: 2.5px solid var(--edge); }
.nav { border-bottom: 2.5px solid var(--edge); }
.video-frame { border: 2.5px solid var(--edge); box-shadow: 10px 10px 0 var(--edge); }
.cta-band { border-block: 2.5px solid var(--edge); }
.cta-band .btn { border-color: var(--on-brand); box-shadow: 5px 5px 0 color-mix(in oklab, var(--on-brand) 55%, transparent); }
`,
  },

  lumen: {
    name: 'Lumen',
    blurb: 'Soft modern product look — pill buttons, gradient washes, floating cards.',
    fonts: {
      display: "'Plus Jakarta Sans', sans-serif",
      body: "'Plus Jakarta Sans', sans-serif",
      params: ['Plus+Jakarta+Sans:wght@400;500;600;700;800'],
      displayWeight: 800,
      tracking: '-0.025em',
    },
    css: `
:root {
  --btn-radius: 999px;
  --card-radius: 22px;
  --card-shadow: 0 18px 44px -22px color-mix(in oklab, var(--brand) 34%, rgb(0 0 0 / 0.32));
}
.hero { background:
  radial-gradient(900px 480px at 12% -10%, color-mix(in oklab, var(--brand) 16%, transparent), transparent 70%),
  radial-gradient(760px 420px at 95% 8%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%);
}
.hl {
  font-style: normal;
  background: linear-gradient(100deg in oklch, var(--brand), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.eyebrow {
  background: var(--brand-soft);
  padding: 7px 16px;
  border-radius: 999px;
  letter-spacing: 0.08em;
  font-size: 12.5px;
}
.btn { background: linear-gradient(100deg, var(--brand), color-mix(in oklab, var(--brand) 62%, var(--accent))); }
.btn:hover { box-shadow: 0 16px 34px -14px color-mix(in oklab, var(--brand) 75%, transparent); }
.btn.ghost { background: var(--surface); box-shadow: inset 0 0 0 1.5px var(--line), var(--card-shadow); color: var(--ink); }
.card { border: 1px solid color-mix(in oklab, var(--line) 60%, transparent); }
.card:hover { transform: translateY(-4px); transition: transform 0.25s ease; }
.card-icon { border-radius: 14px; background: linear-gradient(135deg, var(--brand-soft), var(--accent-soft)); }
.check { background: linear-gradient(135deg, var(--brand), var(--accent)); }
.nav { border-bottom: none; }
.nav-inner { padding-block: 14px; }
.proof { border-block: none; background: var(--bg-alt); border-radius: 0; }
.faq details { box-shadow: var(--card-shadow); border: none; }
.guarantee { border: none; background: linear-gradient(120deg, var(--brand-soft), var(--accent-soft)); }
.offer-head { background: linear-gradient(110deg, var(--brand), color-mix(in oklab, var(--brand) 55%, var(--accent))); }
.cta-band { background: linear-gradient(110deg, var(--brand), color-mix(in oklab, var(--brand) 55%, var(--accent))); }
.avatar { background: linear-gradient(135deg, var(--brand-soft), var(--accent-soft)); }
.cta-band .hl { background: none; -webkit-background-clip: initial; background-clip: initial; color: inherit; text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px; text-decoration-color: color-mix(in oklab, var(--on-brand) 55%, transparent); }
@media (prefers-reduced-motion: reduce) { .card:hover { transform: none; } }
`,
  },
}

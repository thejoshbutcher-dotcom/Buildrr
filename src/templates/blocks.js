// Shared HTML fragments used by the section registry and page assembly.
//
// Text elements carry data-edit="<config path>" so the preview can offer
// inline editing (data-edit-rich = supports *highlight*, data-edit-ml =
// multiline). buildFiles strips all of these from real exports.

import { escapeHtml as esc, extUrl } from './tokens.js'

// data-edit attribute builder. ed('hero.title') → ' data-edit="hero.title"'
export const ed = (path, opts = '') => ` data-edit="${path}"${opts}`
export const RICH = ' data-edit-rich="1"'
export const ML = ' data-edit-ml="1"'

// Named icon shapes for the per-item icon picker; the classic 6 double as the
// automatic rotation when no icon is chosen.
const iconShapes = {
  spark: '<path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/>',
  blocks: '<path d="M4 4h16v4H4zM4 10h10v10H4zM16 10h4v10h-4z"/>',
  pie: '<path d="M12 3a9 9 0 109 9h-9z"/><path d="M14 2a9 9 0 018 8h-8z" opacity="0.55"/>',
  dots: '<circle cx="8" cy="8" r="4.2"/><circle cx="16" cy="16" r="4.2" opacity="0.55"/>',
  chart: '<path d="M3 17l6-6 4 4 8-8v10H3z"/>',
  rings: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 110 10 5 5 0 010-10z"/>',
  bolt: '<path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5z"/>',
  heart: '<path d="M12 21C6.8 16.6 3 13.4 3 9.6 3 6.9 5.1 5 7.6 5c1.8 0 3.4 1 4.4 2.5C13 6 14.6 5 16.4 5 18.9 5 21 6.9 21 9.6c0 3.8-3.8 7-9 11.4z"/>',
  shield: '<path d="M12 2l8 3v6.2c0 4.8-3.4 8.3-8 10.8-4.6-2.5-8-6-8-10.8V5z"/>',
  star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  chat: '<path d="M3 4h18v13H8.4L3 21z"/>',
  target: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12zm0 4a2 2 0 100 4 2 2 0 000-4z"/>',
}
const autoRotation = ['spark', 'blocks', 'pie', 'dots', 'chart', 'rings']

export const iconOptions = [
  ['', 'Auto'],
  ['spark', 'Sparkle'],
  ['blocks', 'Blocks'],
  ['pie', 'Pie chart'],
  ['dots', 'Dots'],
  ['chart', 'Growth'],
  ['rings', 'Rings'],
  ['bolt', 'Lightning'],
  ['heart', 'Heart'],
  ['shield', 'Shield'],
  ['star', 'Star'],
  ['chat', 'Chat'],
  ['target', 'Target'],
]

export const icons = {
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  spark: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3.5v5.2c0 4.6-3.2 7.6-8 9.3-4.8-1.7-8-4.7-8-9.3V6.5z"/><path d="M8.8 12.2l2.3 2.3 4.1-4.6"/></svg>',
  // Named pick with automatic per-index fallback.
  pick: (name, i) => {
    const shape = iconShapes[name] || iconShapes[autoRotation[i % autoRotation.length]]
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">${shape}</svg>`
  },
  icon: (i) => icons.pick('', i),
}

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter((w) => /^[a-zA-Z]/.test(w))
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('') || '★'

export function videoEmbed(rawUrl, title) {
  const u = (rawUrl || '').trim()
  if (!u) {
    return `<div class="video-frame video-placeholder" role="img" aria-label="Video placeholder">
      <div class="vp-inner"><span class="vp-play">▶</span><span class="vp-text">Your video appears here</span></div>
    </div>`
  }
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="${esc(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
  const vm = u.match(/vimeo\.com\/(\d+)/)
  if (vm) return `<div class="video-frame"><iframe src="https://player.vimeo.com/video/${vm[1]}" title="${esc(title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
  if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return `<div class="video-frame"><video controls preload="metadata" src="${esc(u)}"></video></div>`
  return `<div class="video-frame"><iframe src="${esc(u)}" title="${esc(title)}" allowfullscreen loading="lazy"></iframe></div>`
}

// ---- Email capture --------------------------------------------------------
// One place decides, per destination, what endpoint the form posts to, what
// the email / first-name inputs must be named, and how main.js submits it.

export function captureFieldNames(destination) {
  switch (destination) {
    case 'kit':
      return { email: 'email_address', firstName: 'fields[first_name]' }
    case 'mailchimp':
      return { email: 'EMAIL', firstName: 'FNAME' }
    case 'mailerlite':
      return { email: 'fields[email]', firstName: 'fields[name]' }
    default:
      return { email: 'email', firstName: 'name' }
  }
}

// mode ∈ thanks | native | ajax | netlify — read by main.js on submit.
function captureMode(capture) {
  switch (capture.destination) {
    case 'netlify':
      return 'netlify'
    case 'kit':
    case 'formsubmit':
      return 'ajax'
    case 'mailchimp':
    case 'mailerlite':
      return 'native'
    case 'custom':
      return capture.customAjax ? 'ajax' : 'native'
    default:
      return 'thanks'
  }
}

function captureEndpoint(capture, thanksHref) {
  switch (capture.destination) {
    case 'netlify':
      return thanksHref
    case 'formsubmit':
      return capture.email ? `https://formsubmit.co/ajax/${encodeURIComponent(capture.email)}` : '#'
    case 'kit':
    case 'mailchimp':
    case 'mailerlite':
    case 'custom':
      return extUrl(capture.actionUrl) || '#'
    default:
      return '#'
  }
}

// Returns { open, hidden } — the <form> open tag and any hidden inputs to place
// just inside it. formName must be unique per page (Netlify keys submissions on it).
export function captureFormOpen(capture, formName, thanksHref) {
  const cap = capture || { destination: 'thanks' }
  const mode = captureMode(cap)
  const action = captureEndpoint(cap, thanksHref)
  const attrs = [
    'data-form',
    `data-capture="${mode}"`,
    `data-thanks="${esc(thanksHref)}"`,
    `action="${esc(action)}"`,
    'method="post"',
  ]
  let hidden = ''
  if (mode === 'netlify') {
    attrs.push(`name="${esc(formName)}"`, 'data-netlify="true"', 'data-netlify-honeypot="bot-field"')
    hidden =
      `\n      <input type="hidden" name="form-name" value="${esc(formName)}">` +
      `\n      <p hidden><label>Leave this empty <input name="bot-field"></label></p>`
  }
  return { open: `<form ${attrs.join(' ')}>`, hidden }
}

// ---- Shared section fragments ----------------------------------------------

export const sectionHead = (d, base, center = false) => `
  <div class="section-head${center ? ' center' : ''} reveal">
    ${d.eyebrow ? `<span class="eyebrow"${ed(`${base}.eyebrow`)}>${esc(d.eyebrow)}</span>` : ''}
    <h2${ed(`${base}.title`)}>${esc(d.title)}</h2>
  </div>`

export const proofBar = (items, base = 'proof.items') => `
<div class="proof reveal"><div class="container proof-inner">
${(items || []).map((p, i) => `  <div class="proof-item">${icons.spark}<span${ed(`${base}.${i}.text`)}>${esc(p.text)}</span></div>`).join('\n')}
</div></div>`

export const checkItem = (b, base) =>
  `<li><span class="check">${icons.check}</span><span><strong${ed(`${base}.strong`)}>${esc(b.strong)}</strong> <span${ed(`${base}.text`)}>${esc(b.text)}</span></span></li>`

export const quoteCard = (tItem, i, base = 'testimonials.items') => `
<div class="card quote-card reveal d${i % 3}">
  <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
  <blockquote${ed(`${base}.${i}.quote`)}>${esc(tItem.quote)}</blockquote>
  <div class="quote-who">
    <span class="avatar" aria-hidden="true">${initials(tItem.name)}</span>
    <span><span class="who-name"${ed(`${base}.${i}.name`)}>${esc(tItem.name)}</span><br><span class="who-role"${ed(`${base}.${i}.role`)}>${esc(tItem.role)}</span></span>
  </div>
</div>`

export const quotesSection = (d, base = 'testimonials') => `
<section class="alt-bg"><div class="container">
${sectionHead(d, base, true)}
  <div class="grid-3">
${d.items.map((t, i) => quoteCard(t, i, `${base}.items`)).join('\n')}
  </div>
</div></section>`

export const stepsSection = (d, base = 'steps') => {
  const key = d.items ? 'items' : 'steps'
  return `
<section class="alt-bg"><div class="container">
${sectionHead(d, base, true)}
  <div class="steps">
${(d[key] || []).map((s, i) => `    <div class="step reveal d${i}"><h3${ed(`${base}.${key}.${i}.title`)}>${esc(s.title)}</h3><p${ed(`${base}.${key}.${i}.text`)}>${esc(s.text)}</p></div>`).join('\n')}
  </div>
</div></section>`
}

export const faqSection = (d, base = 'faq') => `
<section class="alt-bg"><div class="narrow">
  <div class="section-head center reveal"><h2${ed(`${base}.title`)}>${esc(d.title)}</h2></div>
  <div class="faq reveal d1">
${d.items.map((f, i) => `    <details><summary><span${ed(`${base}.items.${i}.q`)}>${esc(f.q)}</span></summary><p${ed(`${base}.items.${i}.a`)}>${esc(f.a)}</p></details>`).join('\n')}
  </div>
</div></section>`

export const videoSection = (d, base = 'video') => `
<section><div class="container">
${sectionHead(d, base, true)}
  <div class="narrow reveal d1">${videoEmbed(d.videoUrl, d.title)}</div>
</div></section>`

export const checklistSection = (d, base) => `
<section><div class="container">
${sectionHead(d, base)}
  <div class="narrow" style="margin-inline:0">
    <ul class="checklist reveal d1">
${(d.bullets || []).map((b, i) => checkItem(b, `${base}.bullets.${i}`)).join('\n')}
    </ul>
  </div>
</div></section>`

export const bioSection = (d, base) => `
<section class="alt-bg tight"><div class="container">
  ${d.eyebrow ? `<span class="eyebrow reveal"${ed(`${base}.eyebrow`)}>${esc(d.eyebrow)}</span>` : ''}
  <div class="quote-card reveal" style="max-width:720px;display:flex;gap:22px;flex-direction:row;align-items:flex-start">
    ${d.image
      ? `<img class="avatar bio-photo" src="${esc(d.image)}" alt="${esc(d.name)}">`
      : `<span class="avatar" style="width:64px;height:64px;font-size:20px;flex:none" aria-hidden="true">${initials(d.name)}</span>`}
    <div>
      <h3 style="font-size:22px;margin-bottom:4px"${ed(`${base}.name`)}>${esc(d.name)}</h3>
      <p style="color:var(--brand);font-weight:600;font-size:15px;margin-bottom:12px"${ed(`${base}.role`)}>${esc(d.role)}</p>
      <p style="color:var(--mut)"${ed(`${base}.bio`)}>${esc(d.bio)}</p>
    </div>
  </div>
</div></section>`

// Header brand: uploaded logo image if set, otherwise the business name text.
export function navBrand(brand) {
  return brand.logo
    ? `<a class="nav-brand nav-logo" href="index.html"><img src="${esc(brand.logo)}" alt="${esc(brand.name)}"></a>`
    : `<a class="nav-brand" href="index.html"${ed('brand.name')}>${esc(brand.name)}</a>`
}

export function simpleNav(brand, ctaLabel, ctaHref, ctaPath, ctaExtra = '') {
  return `<header class="nav"><div class="container nav-inner">
  ${navBrand(brand)}
  <a class="btn" style="padding:11px 22px;font-size:15px" href="${esc(ctaHref)}"${ctaExtra}${ctaPath ? ed(ctaPath) : ''}>${esc(ctaLabel)}</a>
</div></header>`
}

export function siteNav(brand, pages, current, ctaLabel) {
  return `<header class="nav"><div class="container nav-inner">
  ${navBrand(brand)}
  <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <ul class="nav-links">
${pages.map((p) => `    <li><a href="${p.file}"${p.file === current ? ' aria-current="page"' : ''}>${esc(p.title)}</a></li>`).join('\n')}
    <li><a class="btn" href="contact.html"${ed('global.ctaLabel')}>${esc(ctaLabel)}</a></li>
  </ul>
</div></header>`
}

export function footer(brand, note) {
  const year = new Date().getFullYear()
  return `<footer><div class="container footer-inner">
  <span class="footer-brand"${ed('brand.name')}>${esc(brand.name)}</span>
  ${note ? `<span${ed('settings.footerNote')}>${esc(note)}</span>` : ''}
  <span>© ${year} ${esc(brand.name)}. All rights reserved.</span>
</div></footer>`
}

export function thankYouBody(brand, headline, text, backHref) {
  return `
<main class="thanks-wrap"><div class="narrow">
  <span class="eyebrow">${esc(brand.name)}</span>
  <h1 style="font-size:clamp(34px,5vw,54px);margin-bottom:18px">${esc(headline)}</h1>
  <p style="color:var(--mut);font-size:18px;max-width:520px;margin:0 auto 30px">${esc(text)}</p>
  <a class="btn" href="${backHref}">Back to the page</a>
</div></main>
${footer(brand, '')}`
}

// The section registry: one entry per section a page can contain.
// Each entry: label + blurb (shown in the editor), fields (editor schema,
// dot-paths into config[pageType]), render(ctx) → HTML, and flags:
//   locked — pinned at the top, can't be moved/hidden/removed (heroes)
//   addon  — not in the default layout; offered in the "Add section" list
//
// ctx = { brand, d: config[pageType], buyHref? (sales) }
//
// Text elements carry data-edit="<path>" for inline preview editing
// (see blocks.js `ed`); buildFiles strips these from real exports.

import { escapeHtml as esc, rich, extUrl } from './tokens.js'
import { t, ta, url, img } from '../lib/schema.js'
import {
  icons, iconOptions, initials, videoEmbed, sectionHead, proofBar, checkItem, quoteCard,
  quotesSection, stepsSection, faqSection, videoSection, checklistSection, bioSection,
  captureFormOpen, captureFieldNames, ed, RICH, ML,
} from './blocks.js'

const itemsOf = (label, path, max, fields) => ({ type: 'items', path, label, max, fields })
const iconField = { type: 'select', path: 'icon', label: 'Icon', options: iconOptions }

// A large flexible image with optional caption — offered on every page type.
const imageBlockSection = {
  label: 'Image',
  blurb: 'A large image with an optional caption.',
  addon: true,
  fields: [img('imageBlock.image', 'Image'), t('imageBlock.caption', 'Caption (optional)')],
  render: ({ d }) => `
<section class="tight"><div class="container">
  <figure class="image-block reveal">
    ${d.imageBlock.image
      ? `<img src="${esc(d.imageBlock.image)}" alt="${esc(d.imageBlock.caption || '')}" loading="lazy">`
      : '<div class="img-ph"><span>Your image appears here</span></div>'}
    ${d.imageBlock.caption ? `<figcaption${ed('imageBlock.caption')}>${esc(d.imageBlock.caption)}</figcaption>` : ''}
  </figure>
</div></section>`,
}

// Two-column: header + text + button on one side, image on the other. The
// user picks which side the image sits (defaults right). On every page type.
const imageTextSection = {
  label: 'Image with Text',
  blurb: 'Two columns: heading, text, and a button beside an image.',
  addon: true,
  fields: [
    t('imageText.title', 'Heading'),
    ta('imageText.text', 'Text'),
    t('imageText.buttonLabel', 'Button label', 'Leave blank to hide the button.'),
    url('imageText.buttonUrl', 'Button link'),
    img('imageText.image', 'Image'),
    { type: 'select', path: 'imageText.side', label: 'Image side', options: [['right', 'Image on right'], ['left', 'Image on left']] },
  ],
  render: ({ d }) => {
    const it = d.imageText
    const media = it.image
      ? `<img src="${esc(it.image)}" alt="${esc(it.title || '')}" loading="lazy">`
      : '<div class="img-ph"><span>Your image appears here</span></div>'
    const btn = it.buttonLabel
      ? `<a class="btn" href="${esc(extUrl(it.buttonUrl) || '#')}"${ed('imageText.buttonLabel')}>${esc(it.buttonLabel)}</a>`
      : ''
    return `
<section class="tight"><div class="container">
  <div class="imgtext ${it.side === 'left' ? 'media-left' : 'media-right'} reveal">
    <div class="imgtext-media">${media}</div>
    <div class="imgtext-body">
      <h2${ed('imageText.title')}>${esc(it.title)}</h2>
      <p${ed('imageText.text')}>${esc(it.text)}</p>
      ${btn}
    </div>
  </div>
</div></section>`
  },
}

const proofFields = (path) => [itemsOf('Proof points', path, 4, [t('text', 'Text')])]
const quoteFields = (base) => [
  t(`${base}.eyebrow`, 'Eyebrow'),
  ta(`${base}.title`, 'Section title'),
  itemsOf('Testimonials', `${base}.items`, 6, [ta('quote', 'Quote'), t('name', 'Name'), t('role', 'Role')]),
]
const faqFields = (base) => [
  t(`${base}.title`, 'Section title'),
  itemsOf('Questions', `${base}.items`, 8, [t('q', 'Question'), ta('a', 'Answer')]),
]
const stepFields = (base, key = 'items') => [
  t(`${base}.eyebrow`, 'Eyebrow'),
  ta(`${base}.title`, 'Section title'),
  itemsOf('Steps', `${base}.${key}`, 4, [t('title', 'Step title'), ta('text', 'Detail')]),
]
const videoFields = (base) => [
  t(`${base}.eyebrow`, 'Eyebrow'),
  ta(`${base}.title`, 'Section title'),
  url(`${base}.videoUrl`, 'Video URL', 'YouTube, Vimeo, or direct .mp4 link. Leave blank for a placeholder.'),
]
const bioFields = (base, withEyebrow) => [
  ...(withEyebrow ? [t(`${base}.eyebrow`, 'Eyebrow')] : []),
  t(`${base}.name`, 'Name'),
  t(`${base}.role`, 'Role / credibility line'),
  ta(`${base}.bio`, 'Short bio'),
  img(`${base}.image`, 'Photo', 'Square works best; shown instead of the initials avatar.'),
]

// ---- Opt-in ----------------------------------------------------------------

const optinSections = {
  hero: {
    label: 'Hero + signup form',
    blurb: 'Headline, subhead, and the opt-in form.',
    locked: true,
    fields: [
      t('hero.eyebrow', 'Eyebrow'),
      ta('hero.headline', 'Headline', 'Wrap a phrase in *asterisks* to highlight it.'),
      ta('hero.subhead', 'Subheadline'),
      t('hero.formTitle', 'Form title'),
      t('hero.formSub', 'Form subtitle'),
      t('hero.ctaLabel', 'Button label'),
      t('hero.privacy', 'Privacy note'),
    ],
    render: ({ d }) => {
      const form = captureFormOpen(d.capture, 'optin', 'thank-you.html')
      const n = captureFieldNames(d.capture?.destination)
      return `
<section class="hero"><div class="container hero-split">
  <div>
    <span class="eyebrow reveal"${ed('hero.eyebrow')}>${esc(d.hero.eyebrow)}</span>
    <h1 class="reveal"${ed('hero.headline', RICH)}>${rich(d.hero.headline)}</h1>
    <p class="lead reveal d1"${ed('hero.subhead')}>${esc(d.hero.subhead)}</p>
  </div>
  <div class="form-card reveal d2" id="signup">
    <h3${ed('hero.formTitle')}>${esc(d.hero.formTitle)}</h3>
    <p class="form-sub"${ed('hero.formSub')}>${esc(d.hero.formSub)}</p>
    ${form.open}${form.hidden}
      <div class="field"><label for="of-name">First name</label><input id="of-name" type="text" name="${n.firstName}" placeholder="Your first name" required></div>
      <div class="field"><label for="of-email">Email address</label><input id="of-email" type="email" name="${n.email}" placeholder="you@example.com" required></div>
      <button class="btn" type="submit"${ed('hero.ctaLabel')}>${esc(d.hero.ctaLabel)}</button>
    </form>
    <p class="privacy-note"${ed('hero.privacy')}>${esc(d.hero.privacy)}</p>
  </div>
</div></section>`
    },
  },
  proof: {
    label: 'Proof bar',
    blurb: 'A slim strip of credibility points.',
    fields: proofFields('proof.items'),
    render: ({ d }) => proofBar(d.proof.items),
  },
  learn: {
    label: 'What they’ll learn',
    blurb: 'Checklist of what the freebie delivers.',
    fields: [
      t('learn.eyebrow', 'Eyebrow'),
      t('learn.title', 'Section title'),
      itemsOf('Bullets', 'learn.bullets', 6, [t('strong', 'Lead-in'), ta('text', 'Detail')]),
    ],
    render: ({ d }) => checklistSection(d.learn, 'learn'),
  },
  host: {
    label: 'About the host',
    blurb: 'A short trust-building bio card.',
    fields: bioFields('host', false),
    render: ({ d }) => bioSection(d.host, 'host'),
  },
  steps: {
    label: 'How it works',
    blurb: 'Three numbered steps from signup to result.',
    addon: true,
    fields: stepFields('steps'),
    render: ({ d }) => stepsSection(d.steps, 'steps'),
  },
  testimonials: {
    label: 'Testimonials',
    blurb: 'A grid of quotes from past subscribers.',
    addon: true,
    fields: quoteFields('testimonials'),
    render: ({ d }) => quotesSection(d.testimonials),
  },
  faq: {
    label: 'FAQ',
    blurb: 'Answer objections before they close the tab.',
    addon: true,
    fields: faqFields('faq'),
    render: ({ d }) => faqSection(d.faq),
  },
  video: {
    label: 'Video block',
    blurb: 'An embedded video with its own heading.',
    addon: true,
    fields: videoFields('video'),
    render: ({ d }) => videoSection(d.video),
  },
  image: imageBlockSection,
  imageText: imageTextSection,
  cta: {
    label: 'Closing call-to-action',
    blurb: 'Full-width color band repeating the offer.',
    fields: [],
    render: ({ d }) => `
<section class="cta-band"><div class="container reveal">
  <h2${ed('hero.headline', RICH)}>${rich(d.hero.headline)}</h2>
  <p${ed('hero.formSub')}>${esc(d.hero.formSub)}</p>
  <a class="btn big" href="#signup"${ed('hero.ctaLabel')}>${esc(d.hero.ctaLabel)}</a>
  <p class="btn-note"${ed('hero.privacy')}>${esc(d.hero.privacy)}</p>
</div></section>`,
  },
}

// ---- Sales -----------------------------------------------------------------

// Buy buttons carry their checkout state so the preview can route a click on
// an unconfigured button to the Publish tab (stripped from exports).
export const buyAttr = (d) => ` data-buy="${d.offer.checkoutUrl?.trim() ? 'ok' : 'missing'}"`

const salesSections = {
  hero: {
    label: 'Hero + VSL',
    blurb: 'Headline, optional video, and the first buy button.',
    locked: true,
    fields: [
      t('hero.eyebrow', 'Eyebrow'),
      ta('hero.headline', 'Headline', 'Wrap a phrase in *asterisks* to highlight it.'),
      ta('hero.subhead', 'Subheadline'),
      { type: 'toggle', path: 'hero.showVideo', label: 'Include VSL / video' },
      url('hero.videoUrl', 'Video URL', 'YouTube, Vimeo, or direct .mp4 link. Leave blank for a placeholder.'),
      t('hero.ctaLabel', 'Button label'),
      t('hero.ctaNote', 'Under-button note'),
    ],
    render: ({ d, buyHref }) => `
<section class="hero hero-center"><div class="container">
  <span class="eyebrow reveal"${ed('hero.eyebrow')}>${esc(d.hero.eyebrow)}</span>
  <h1 class="reveal" style="max-width:940px;margin-inline:auto"${ed('hero.headline', RICH)}>${rich(d.hero.headline)}</h1>
  <p class="lead reveal d1" style="max-width:680px;margin-inline:auto"${ed('hero.subhead')}>${esc(d.hero.subhead)}</p>
  ${d.hero.showVideo ? `<div class="narrow reveal d2" style="margin-bottom:36px">${videoEmbed(d.hero.videoUrl, d.hero.headline.replace(/\*/g, ''))}</div>` : ''}
  <div class="reveal d2">
    <a class="btn big" href="${esc(buyHref)}"${buyAttr(d)}${ed('hero.ctaLabel')}>${esc(d.hero.ctaLabel)}</a>
    <p class="btn-note"${ed('hero.ctaNote')}>${esc(d.hero.ctaNote)}</p>
  </div>
</div></section>`,
  },
  proof: {
    label: 'Proof bar',
    blurb: 'A slim strip of credibility points.',
    fields: proofFields('proof.items'),
    render: ({ d }) => proofBar(d.proof.items),
  },
  pain: {
    label: 'Pain points',
    blurb: 'Name the problem so the offer lands.',
    fields: [
      t('pain.eyebrow', 'Eyebrow'),
      ta('pain.title', 'Section title'),
      itemsOf('Pain points', 'pain.items', 4, [t('strong', 'Lead-in'), ta('text', 'Detail'), iconField]),
    ],
    render: ({ d }) => `
<section><div class="container">
${sectionHead(d.pain, 'pain')}
  <div class="grid-3">
${d.pain.items.map((p, i) => `    <div class="card reveal d${i}"><div class="card-icon">${icons.pick(p.icon, i)}</div><h3${ed(`pain.items.${i}.strong`)}>${esc(p.strong)}</h3><p${ed(`pain.items.${i}.text`)}>${esc(p.text)}</p></div>`).join('\n')}
  </div>
</div></section>`,
  },
  how: {
    label: 'How it works',
    blurb: 'The method, in numbered phases.',
    fields: stepFields('how', 'steps'),
    render: ({ d }) => stepsSection(d.how, 'how'),
  },
  benefits: {
    label: 'What’s inside',
    blurb: 'Feature/benefit cards for the offer.',
    fields: [
      t('benefits.eyebrow', 'Eyebrow'),
      ta('benefits.title', 'Section title'),
      itemsOf('Benefits', 'benefits.items', 6, [t('title', 'Title'), ta('text', 'Detail'), iconField]),
    ],
    render: ({ d }) => `
<section><div class="container">
${sectionHead(d.benefits, 'benefits')}
  <div class="grid-2">
${d.benefits.items.map((b, i) => `    <div class="card reveal d${i % 2}"><div class="card-icon">${icons.pick(b.icon, i + 2)}</div><h3${ed(`benefits.items.${i}.title`)}>${esc(b.title)}</h3><p${ed(`benefits.items.${i}.text`)}>${esc(b.text)}</p></div>`).join('\n')}
  </div>
</div></section>`,
  },
  testimonials: {
    label: 'Testimonials',
    blurb: 'A grid of student/customer results.',
    fields: quoteFields('testimonials'),
    render: ({ d }) => quotesSection(d.testimonials),
  },
  offer: {
    label: 'Offer stack & price',
    blurb: 'Value-anchored list of everything included.',
    fields: [
      t('offer.eyebrow', 'Eyebrow'),
      ta('offer.title', 'Section title'),
      img('offer.image', 'Product image', 'Shown centered below the heading — great for a product or package shot.'),
      { type: 'range', path: 'offer.imageWidth', label: 'Image size', min: 20, max: 100, def: 60, showIf: (c) => !!c.offer.image },
      t('offer.boxTitle', 'Offer box title'),
      itemsOf('What’s included', 'offer.items', 8, [t('name', 'Item'), t('value', 'Value')]),
      t('offer.price', 'Price'),
      t('offer.priceWas', 'Anchor price (strikethrough)'),
      t('offer.priceNote', 'Price note'),
      t('offer.ctaLabel', 'Buy button label'),
      url('offer.checkoutUrl', 'Checkout URL', 'Stripe payment link, ThriveCart, etc. Leave blank for a placeholder.'),
    ],
    render: ({ d }) => `
<section id="offer"><div class="narrow">
  <div class="section-head center reveal">
    <span class="eyebrow"${ed('offer.eyebrow')}>${esc(d.offer.eyebrow)}</span>
    <h2${ed('offer.title')}>${esc(d.offer.title)}</h2>
  </div>
  ${d.offer.image ? `<img class="offer-image reveal" style="width:${Math.min(100, Math.max(20, Number(d.offer.imageWidth) || 60))}%" src="${esc(d.offer.image)}" alt="${esc(d.offer.boxTitle || '')}" loading="lazy">` : ''}
  <div class="offer-box reveal">
    <div class="offer-head"><h3${ed('offer.boxTitle')}>${esc(d.offer.boxTitle)}</h3></div>
    <ul class="offer-list">
${d.offer.items.map((o, i) => `      <li><span${ed(`offer.items.${i}.name`)}>${esc(o.name)}</span><span class="value"${ed(`offer.items.${i}.value`)}>${esc(o.value)}</span></li>`).join('\n')}
    </ul>
    <div class="offer-cta">
      <div class="price-line">${d.offer.priceWas ? `<span class="price-was"${ed('offer.priceWas')}>${esc(d.offer.priceWas)}</span>` : ''}<span class="price"${ed('offer.price')}>${esc(d.offer.price)}</span></div>
      <p class="price-note"${ed('offer.priceNote')}>${esc(d.offer.priceNote)}</p>
      <a class="btn big" href="${esc(extUrl(d.offer.checkoutUrl) || '#')}"${buyAttr(d)}${ed('offer.ctaLabel')}>${esc(d.offer.ctaLabel)}</a>
      <p class="btn-note"${ed('hero.ctaNote')}>${esc(d.hero.ctaNote)}</p>
    </div>
  </div>
</div></section>`,
  },
  guarantee: {
    label: 'Guarantee',
    blurb: 'Risk-reversal box with a badge.',
    fields: [t('guarantee.title', 'Guarantee title'), ta('guarantee.text', 'Guarantee text')],
    render: ({ d }) => `
<section class="tight"><div class="narrow">
  <div class="guarantee reveal">
    <span class="guarantee-badge">${icons.shield}</span>
    <div><h3${ed('guarantee.title')}>${esc(d.guarantee.title)}</h3><p${ed('guarantee.text')}>${esc(d.guarantee.text)}</p></div>
  </div>
</div></section>`,
  },
  faq: {
    label: 'FAQ',
    blurb: 'Answer objections before they close the tab.',
    fields: faqFields('faq'),
    render: ({ d }) => faqSection(d.faq),
  },
  final: {
    label: 'Final call-to-action',
    blurb: 'Full-width color band with the last buy button.',
    fields: [ta('final.title', 'Headline'), ta('final.text', 'Supporting line'), t('final.ctaLabel', 'Button label'), t('final.ctaNote', 'Urgency note')],
    render: ({ d, buyHref }) => `
<section class="cta-band"><div class="container reveal">
  <h2${ed('final.title')}>${esc(d.final.title)}</h2>
  <p${ed('final.text')}>${esc(d.final.text)}</p>
  <a class="btn big" href="${esc(buyHref)}"${buyAttr(d)}${ed('final.ctaLabel')}>${esc(d.final.ctaLabel)}</a>
  <p class="btn-note"${ed('final.ctaNote')}>${esc(d.final.ctaNote)}</p>
</div></section>`,
  },
  author: {
    label: 'About the author',
    blurb: 'Instructor/founder bio for credibility.',
    addon: true,
    fields: bioFields('author', true),
    render: ({ d }) => bioSection(d.author, 'author'),
  },
  checklist: {
    label: 'Outcome checklist',
    blurb: '“By the end you’ll have…” checkmark list.',
    addon: true,
    fields: [
      t('checklist.eyebrow', 'Eyebrow'),
      ta('checklist.title', 'Section title'),
      itemsOf('Bullets', 'checklist.bullets', 6, [t('strong', 'Lead-in'), ta('text', 'Detail')]),
    ],
    render: ({ d }) => checklistSection(d.checklist, 'checklist'),
  },
  video: {
    label: 'Video block',
    blurb: 'An extra embedded video mid-page.',
    addon: true,
    fields: videoFields('video'),
    render: ({ d }) => videoSection(d.video),
  },
  image: imageBlockSection,
  imageText: imageTextSection,
}

// ---- Site (per page) --------------------------------------------------------

const siteShared = {
  proof: {
    label: 'Proof bar',
    blurb: 'A slim strip of credibility points.',
    addon: true,
    fields: proofFields('proof.items'),
    render: ({ d }) => proofBar(d.proof.items),
  },
  testimonials: {
    label: 'Testimonials',
    blurb: 'A grid of client quotes (shared across pages).',
    addon: true,
    fields: quoteFields('testimonials'),
    render: ({ d }) => quotesSection(d.testimonials),
  },
  steps: {
    label: 'How we work',
    blurb: 'Numbered process steps (shared across pages).',
    addon: true,
    fields: stepFields('steps'),
    render: ({ d }) => stepsSection(d.steps, 'steps'),
  },
  faq: {
    label: 'FAQ',
    blurb: 'Common questions (shared across pages).',
    addon: true,
    fields: faqFields('faq'),
    render: ({ d }) => faqSection(d.faq),
  },
  image: imageBlockSection,
  imageText: imageTextSection,
}

const siteCta = (heading, headPath) => ({
  label: 'Call-to-action band',
  blurb: 'Full-width color band pointing to Contact.',
  fields: [],
  render: ({ d }) => `
<section class="cta-band"><div class="container reveal">
  <h2${headPath ? ed(headPath) : ''}>${esc(heading(d))}</h2>
  <p${ed('contact.hero.subhead')}>${esc(d.contact.hero.subhead)}</p>
  <a class="btn big" href="contact.html"${ed('global.ctaLabel')}>${esc(d.global.ctaLabel)}</a>
</div></section>`,
})

const siteSections = {
  home: {
    hero: {
      label: 'Hero',
      blurb: 'Headline, subhead, and the two main buttons.',
      locked: true,
      fields: [
        t('home.hero.eyebrow', 'Eyebrow'),
        ta('home.hero.headline', 'Headline', 'Wrap a phrase in *asterisks* to highlight it.'),
        ta('home.hero.subhead', 'Subheadline'),
      ],
      render: ({ d }) => `
<section class="hero"><div class="container">
  <span class="eyebrow reveal"${ed('home.hero.eyebrow')}>${esc(d.home.hero.eyebrow)}</span>
  <h1 class="reveal" style="max-width:880px"${ed('home.hero.headline', RICH)}>${rich(d.home.hero.headline)}</h1>
  <p class="lead reveal d1"${ed('home.hero.subhead')}>${esc(d.home.hero.subhead)}</p>
  <div class="reveal d2" style="display:flex;gap:14px;flex-wrap:wrap">
    <a class="btn big" href="contact.html"${ed('global.ctaLabel')}>${esc(d.global.ctaLabel)}</a>
    <a class="btn big ghost" href="services.html">See services</a>
  </div>
</div></section>`,
    },
    services: {
      label: 'Services teaser',
      blurb: 'Three cards summarizing what you offer.',
      fields: [
        t('home.services.eyebrow', 'Eyebrow'),
        t('home.services.title', 'Section title'),
        itemsOf('Services', 'home.services.items', 3, [t('title', 'Title'), ta('text', 'Detail'), iconField]),
      ],
      render: ({ d }) => `
<section class="alt-bg"><div class="container">
${sectionHead(d.home.services, 'home.services')}
  <div class="grid-3">
${d.home.services.items.map((s, i) => `    <div class="card reveal d${i}"><div class="card-icon">${icons.pick(s.icon, i)}</div><h3${ed(`home.services.items.${i}.title`)}>${esc(s.title)}</h3><p${ed(`home.services.items.${i}.text`)}>${esc(s.text)}</p></div>`).join('\n')}
  </div>
</div></section>`,
    },
    about: {
      label: 'About + featured quote',
      blurb: 'Studio intro beside a client testimonial.',
      fields: [
        t('home.about.eyebrow', 'Eyebrow'),
        t('home.about.title', 'Title'),
        ta('home.about.text', 'Paragraph'),
        ta('home.testimonial.quote', 'Testimonial quote'),
        t('home.testimonial.name', 'Name'),
        t('home.testimonial.role', 'Role'),
      ],
      render: ({ d }) => `
<section><div class="container hero-split">
  <div class="reveal">
    <span class="eyebrow"${ed('home.about.eyebrow')}>${esc(d.home.about.eyebrow)}</span>
    <h2 style="font-size:clamp(30px,4vw,44px);margin-bottom:16px"${ed('home.about.title')}>${esc(d.home.about.title)}</h2>
    <p style="color:var(--mut);font-size:18px;margin-bottom:26px"${ed('home.about.text')}>${esc(d.home.about.text)}</p>
    <a class="btn ghost" href="about.html">More about us</a>
  </div>
  <div class="card quote-card reveal d1">
    <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
    <blockquote${ed('home.testimonial.quote')}>${esc(d.home.testimonial.quote)}</blockquote>
    <div class="quote-who">
      <span class="avatar" aria-hidden="true">${initials(d.home.testimonial.name)}</span>
      <span><span class="who-name"${ed('home.testimonial.name')}>${esc(d.home.testimonial.name)}</span><br><span class="who-role"${ed('home.testimonial.role')}>${esc(d.home.testimonial.role)}</span></span>
    </div>
  </div>
</div></section>`,
    },
    cta: siteCta((d) => d.global.tagline, 'global.tagline'),
    ...siteShared,
  },

  about: {
    hero: {
      label: 'Page intro',
      blurb: 'The About page headline block.',
      locked: true,
      fields: [t('about.hero.eyebrow', 'Eyebrow'), ta('about.hero.headline', 'Headline'), ta('about.hero.subhead', 'Subheadline')],
      render: ({ d }) => `
<section class="hero" style="padding-block:clamp(60px,8vw,96px)"><div class="container">
  <span class="eyebrow reveal"${ed('about.hero.eyebrow')}>${esc(d.about.hero.eyebrow)}</span>
  <h1 class="reveal" style="max-width:820px;font-size:clamp(36px,5.4vw,60px)"${ed('about.hero.headline', RICH)}>${rich(d.about.hero.headline)}</h1>
  <p class="lead reveal d1"${ed('about.hero.subhead')}>${esc(d.about.hero.subhead)}</p>
</div></section>`,
    },
    story: {
      label: 'Story',
      blurb: 'Long-form paragraphs about the company.',
      fields: [ta('about.story', 'Story', 'Blank line starts a new paragraph.')],
      render: ({ d }) => `
<section class="tight"><div class="narrow reveal"${ed('about.story', ML)}>${(d.about.story || '')
        .split(/\n\s*\n/)
        .map((p) => `<p style="color:var(--mut);font-size:18px;margin-bottom:20px">${esc(p)}</p>`)
        .join('\n')}</div></section>`,
    },
    values: {
      label: 'Values',
      blurb: 'Three cards for what you stand for.',
      fields: [
        t('about.values.title', 'Section title'),
        itemsOf('Values', 'about.values.items', 4, [t('title', 'Title'), ta('text', 'Detail'), iconField]),
      ],
      render: ({ d }) => `
<section class="alt-bg"><div class="container">
  <div class="section-head reveal"><h2${ed('about.values.title')}>${esc(d.about.values.title)}</h2></div>
  <div class="grid-3">
${d.about.values.items.map((v, i) => `    <div class="card reveal d${i}"><div class="card-icon">${icons.pick(v.icon, i + 3)}</div><h3${ed(`about.values.items.${i}.title`)}>${esc(v.title)}</h3><p${ed(`about.values.items.${i}.text`)}>${esc(v.text)}</p></div>`).join('\n')}
  </div>
</div></section>`,
    },
    founder: {
      label: 'Founder bio',
      blurb: 'Who runs the place, with an avatar card.',
      fields: bioFields('about.founder', false),
      render: ({ d }) => bioSection(d.about.founder, 'about.founder'),
    },
    cta: siteCta((d) => d.global.tagline, 'global.tagline'),
    testimonials: siteShared.testimonials,
    faq: siteShared.faq,
    image: imageBlockSection,
  imageText: imageTextSection,
  },

  services: {
    hero: {
      label: 'Page intro',
      blurb: 'The Services page headline block.',
      locked: true,
      fields: [t('services.hero.eyebrow', 'Eyebrow'), ta('services.hero.headline', 'Headline'), ta('services.hero.subhead', 'Subheadline')],
      render: ({ d }) => `
<section class="hero" style="padding-block:clamp(60px,8vw,96px)"><div class="container">
  <span class="eyebrow reveal"${ed('services.hero.eyebrow')}>${esc(d.services.hero.eyebrow)}</span>
  <h1 class="reveal" style="max-width:820px;font-size:clamp(36px,5.4vw,60px)"${ed('services.hero.headline', RICH)}>${rich(d.services.hero.headline)}</h1>
  <p class="lead reveal d1"${ed('services.hero.subhead')}>${esc(d.services.hero.subhead)}</p>
</div></section>`,
    },
    list: {
      label: 'Service packages',
      blurb: 'Detailed cards with pricing and inclusions.',
      fields: [
        itemsOf('Services', 'services.items', 4, [
          t('title', 'Service'),
          t('price', 'Price line'),
          iconField,
          ta('text', 'Description'),
          ta('includes', 'Includes (one per line)'),
        ]),
      ],
      render: ({ d }) => `
<section class="tight" style="padding-bottom:clamp(64px,9vw,112px)"><div class="container">
  <div class="grid-3" style="align-items:start">
${d.services.items
        .map(
          (s, i) => `    <div class="card reveal d${i}">
      <div class="card-icon">${icons.pick(s.icon, i)}</div>
      <h3${ed(`services.items.${i}.title`)}>${esc(s.title)}</h3>
      <p class="svc-price"${ed(`services.items.${i}.price`)}>${esc(s.price)}</p>
      <p${ed(`services.items.${i}.text`)}>${esc(s.text)}</p>
      <ul class="svc-includes"${ed(`services.items.${i}.includes`, ML)}>
${(s.includes || '').split('\n').filter(Boolean).map((line) => `        <li>${esc(line)}</li>`).join('\n')}
      </ul>
    </div>`
        )
        .join('\n')}
  </div>
</div></section>`,
    },
    cta: siteCta(() => 'Not sure which fits?'),
    steps: siteShared.steps,
    testimonials: siteShared.testimonials,
    faq: siteShared.faq,
    image: imageBlockSection,
  imageText: imageTextSection,
  },

  contact: {
    hero: {
      label: 'Intro + contact form',
      blurb: 'Headline, contact details, and the form.',
      locked: true,
      fields: [t('contact.hero.eyebrow', 'Eyebrow'), ta('contact.hero.headline', 'Headline'), ta('contact.hero.subhead', 'Subheadline')],
      render: ({ d }) => {
        const form = captureFormOpen(d.capture, 'contact', 'thank-you.html')
        const n = captureFieldNames(d.capture?.destination)
        return `
<section class="hero" style="padding-block:clamp(60px,8vw,96px)"><div class="container hero-split">
  <div>
    <span class="eyebrow reveal"${ed('contact.hero.eyebrow')}>${esc(d.contact.hero.eyebrow)}</span>
    <h1 class="reveal" style="font-size:clamp(36px,5.4vw,60px)"${ed('contact.hero.headline', RICH)}>${rich(d.contact.hero.headline)}</h1>
    <p class="lead reveal d1"${ed('contact.hero.subhead')}>${esc(d.contact.hero.subhead)}</p>
    <div class="contact-info reveal d2">
      <span><a href="mailto:${esc(d.contact.email)}"${ed('contact.email')}>${esc(d.contact.email)}</a></span>
      <span${ed('contact.phone')}>${esc(d.contact.phone)}</span>
      <span style="color:var(--mut)"${ed('contact.location')}>${esc(d.contact.location)}</span>
    </div>
  </div>
  <div class="form-card reveal d2">
    <h3>Send a note</h3>
    <p class="form-sub">We reply within one business day.</p>
    ${form.open}${form.hidden}
      <div class="field"><label for="cf-name">Name</label><input id="cf-name" type="text" name="${n.firstName}" placeholder="Your name" required></div>
      <div class="field"><label for="cf-email">Email</label><input id="cf-email" type="email" name="${n.email}" placeholder="you@example.com" required></div>
      <div class="field"><label for="cf-msg">What are you building?</label><textarea id="cf-msg" name="message" rows="4" placeholder="A few lines about your project and timing" required></textarea></div>
      <button class="btn" type="submit">Send message</button>
    </form>
  </div>
</div></section>`
      },
    },
    faq: siteShared.faq,
    image: imageBlockSection,
  imageText: imageTextSection,
  },
}

// registryFor('optin') → flat registry; registryFor('site', 'home') → that page's.
export function registryFor(pageType, sitePage) {
  if (pageType === 'site') return siteSections[sitePage] || siteSections.home
  return pageType === 'optin' ? optinSections : salesSections
}

export const sitePageKeys = { 'index.html': 'home', 'about.html': 'about', 'services.html': 'services', 'contact.html': 'contact' }

// Color math + CSS variable generation shared by every skin.

export function hexToRgb(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function channel(c) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

// Returns near-white or near-black, whichever reads better on the given color.
export function onColor(hex) {
  return luminance(hex) > 0.42 ? '#101014' : '#ffffff'
}

export function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

// Escape + turn *emphasized* fragments into a highlight span skins can style.
export function rich(str = '') {
  return escapeHtml(str).replace(/\*([^*]+)\*/g, '<em class="hl">$1</em>')
}

// Normalize a user-pasted external URL: trim, and add https:// when the
// protocol is missing so exported links never resolve as relative paths.
export function extUrl(raw = '') {
  const u = String(raw).trim()
  if (!u || u === '#') return ''
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('//')) return `https:${u}`
  return `https://${u.replace(/^\/+/, '')}`
}

export function slugify(str = '') {
  return (
    String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'landing-page'
  )
}

// The CSS custom properties every skin builds on. Tone decides the base
// canvas; brand colors thread through via color-mix so any palette works.
export function cssVars(brand, tone) {
  const { primary, accent } = brand
  const onBrand = onColor(primary)
  const onAccent = onColor(accent)

  const tones = {
    light: {
      ink: '#16171c',
      mut: '#5b5e6a',
      vars: `
  --bg: #ffffff;
  --bg-alt: color-mix(in oklab, var(--brand) 4%, #f7f7f8);
  --line: color-mix(in oklab, var(--ink) 12%, transparent);
  --surface: #ffffff;
  --shade: color-mix(in oklab, var(--brand) 8%, #f2f2f4);`,
    },
    tinted: {
      ink: 'color-mix(in oklab, var(--brand) 14%, #17181d)',
      mut: 'color-mix(in oklab, var(--brand) 10%, #565963)',
      vars: `
  --bg: color-mix(in oklab, var(--brand) 5%, #fdfdfc);
  --bg-alt: color-mix(in oklab, var(--brand) 10%, #f8f8f6);
  --line: color-mix(in oklab, var(--ink) 13%, transparent);
  --surface: #ffffff;
  --shade: color-mix(in oklab, var(--brand) 12%, #f1f1ef);`,
    },
    dark: {
      ink: '#f4f4f2',
      mut: 'color-mix(in oklab, #f4f4f2 62%, transparent)',
      vars: `
  --bg: color-mix(in oklab, var(--brand) 7%, #0d0e12);
  --bg-alt: color-mix(in oklab, var(--brand) 11%, #13141a);
  --line: color-mix(in oklab, #f4f4f2 14%, transparent);
  --surface: color-mix(in oklab, var(--brand) 9%, #171821);
  --shade: color-mix(in oklab, var(--brand) 14%, #191a22);`,
    },
  }
  const T = tones[tone] || tones.light

  // "Invert text" flips ink/mut for text sitting directly on a section's
  // background image — light tones get light text, dark tone gets dark text.
  const inverted =
    tone === 'dark'
      ? { ink: '#15161b', mut: 'rgb(21 22 27 / 0.72)' }
      : { ink: '#f6f7f8', mut: 'rgb(246 247 248 / 0.8)' }

  return `:root {
  --brand: ${primary};
  --accent: ${accent};
  --on-brand: ${onBrand};
  --on-accent: ${onAccent};
  --brand-soft: color-mix(in oklab, var(--brand) 14%, transparent);
  --accent-soft: color-mix(in oklab, var(--accent) 20%, transparent);
  --ink: ${T.ink};
  --mut: ${T.mut};
${T.vars}
}
/* Sections with a background image can invert their direct text; anything on
   a card/box keeps the normal tone colors. */
.bg-invert {
  --ink: ${inverted.ink};
  --mut: ${inverted.mut};
  color: var(--ink);
}
.bg-invert :is(.card, .form-card, .offer-box, .faq details, .guarantee) {
  --ink: ${T.ink};
  --mut: ${T.mut};
  color: var(--ink);
}`
}

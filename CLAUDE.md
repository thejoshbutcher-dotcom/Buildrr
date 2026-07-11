# Buildrr — dev notes (formerly Pagesmith)

Vite + React builder that generates static landing pages, plus a tiny Express API
(`server/`) for one-click Netlify publishing. `npm run dev` → :5173 (Vite proxies
`/api` → :8787, the `npm run server` Node process). In prod, `npm start` serves the
built `dist/` + `/api` from one Express process (Hostinger Node.js app).
Two routes (no router lib, see `src/main.jsx`): `/` is the marketing home page
(`src/Home.jsx`, `.mkt-*` styles), `/app` is the builder. The builder logo
navigates back to `/`.

Export pipeline: `src/lib/export.js` `assembleSite(config)` is the single source of
deployable files (`{ path: { data, encoding } }`, images extracted to `img/`) —
reused by `exportZip`, `buildSingleHtml` (one self-contained .html for GHL/funnels,
CSS/JS/images inlined), and Netlify publish. `src/lib/netlify.js` (client) posts
`assembleSite` output to `/api/netlify/deploy`; the server (`server/netlify.js`)
does OAuth token exchange + file-digest deploys (and PATCHes the site with
`processing_settings.ignore_html_forms:false` on every deploy — Netlify disables
form detection by default on API-created sites, else Netlify Forms 404). Secrets/token stay server-side
(`server/store.js`, httpOnly `buildrr_sid` cookie). Env: `NETLIFY_CLIENT_ID/SECRET/
REDIRECT_URI` (auto-loaded from `.env`); unset → Publish tab falls back to manual
Netlify Drop. Per-page-type Netlify site id saved in `config[pageType].publish`.
Brand logo (`brand.logo`, data URI) replaces the nav name via `navBrand` in blocks.js.

## Architecture

The core is a pure template engine in `src/templates/`; React is only the editor shell.

- `src/templates/sections.js` — THE section registry. One entry per section a page
  can contain: `{ label, blurb, fields, render(ctx), locked?, addon? }`. `locked` =
  pinned hero (can't move/hide/remove); `addon` = offered in the "Add section" list
  instead of the default layout. `registryFor(pageType, sitePage?)` returns the flat
  registry; site pages each have their own (shared add-ons like testimonials/faq
  read one shared content subtree, so the same section on two pages edits one copy).
- `src/templates/blocks.js` — shared render primitives (proofBar, quotesSection,
  faqSection, stepsSection, bioSection, navs, footer, videoEmbed…). Also `ed()`:
  text elements carry `data-edit="<config path>"` (+`data-edit-rich` for *highlight*
  fields, `data-edit-ml` for multiline) so the preview offers inline editing;
  `renderSections` adds `data-sec="<key>"` per section root. Both are STRIPPED from
  real exports by `stripEditAttrs` in build.js — keep new template text annotated.
- `src/templates/build.js` — `buildFiles(config, {preview})` → `{ files, pages, zipName }`.
  Assembles each page as nav + visible layout sections in order + footer.
  `preview: true` inlines CSS+JS for iframe `srcdoc` and appends a preview script
  that postMessages link clicks / form submits to the builder.
- `src/templates/baseCss.js` — shared layout/component CSS, parameterized by CSS
  custom properties. Skins override on top; watch selector specificity.
- `src/templates/skins.js` — the 3 skins (editorial / impact / lumen): fonts
  (Google Fonts params) + a CSS override block each. Also `headlineFonts` overrides.
- `src/templates/tokens.js` — color math (contrast-aware `--on-brand`), `cssVars()`
  builds the `:root` block per brand+tone (light/tinted/dark via `color-mix`).
- `src/lib/schema.js` — per-page-type default copy incl. add-on sections, default
  `_layout` arrays, pinned (non-section) editor groups, and the `t/ta/url` field
  helpers. Field `path`s are dot-paths into `config[pageType]`.
- `src/components/SectionList.jsx` — the section editor: HTML5 drag-to-reorder
  (drag index kept in a ref so dragenter sees it synchronously), hide (eye),
  remove (✕, content kept so re-adding restores), and the add-on picker.
- `src/components/Preview.jsx` — iframe preview + the injected preview script:
  inline editing ([data-edit] → contenteditable; serialized back through
  postMessage, rich fields re-emit `*…*`), section-click → editor focus, link/
  form interception. While an inline edit is focused the srcdoc is FROZEN
  (displayHtml gated on `editing`) so regeneration can't destroy the cursor;
  it re-syncs ~600ms after blur.
- `src/components/PublishPanel.jsx` — the third sidebar tab: email-capture
  destination picker + per-provider fields/hints, and deploy guidance. Sales shows
  a note pointing to the Offer section's checkout URL instead (it has no email form).
- `src/lib/export.js` — JSZip download of `buildFiles` output.

Email capture: `optin.capture` / `site.capture` = `{ destination, actionUrl, email,
customAjax }`. `destination` ∈ thanks|netlify|kit|mailchimp|mailerlite|formsubmit|
custom. `blocks.js` owns the mapping: `captureFieldNames(destination)` (email/first-
name input `name`s each provider needs) and `captureFormOpen(capture, formName,
thanksHref)` (builds the `<form>` open tag with the right action, `data-capture`
mode, and Netlify hidden inputs). `mainJs.js` submit handler branches on
`data-capture`: thanks→go to thanks, native/netlify→let it POST, ajax→fetch then
redirect to thanks. Adding a provider = one row in `captureFieldNames`, the mode
maps in `captureMode`/`captureEndpoint`, and an entry in PublishPanel's `DESTINATIONS`.

Images: every layout entry can carry `bg: { image, opacity, invert }` (edited in
each section's group via SectionList's BgPanel; rendered by `injectBg` in build.js
as a `.sec-bg` layer under z-lifted content; `invert` adds `.bg-invert`, whose
tone-aware ink/mut flip is emitted by `cssVars` — cards/boxes re-reset to normal).
`offer.image`/`offer.imageWidth` = product shot under the offer heading (range
field with `showIf`). Content images (bio `image`, `imageBlock`)
use the `image` field type (`ImageField` in Fields.jsx — uploads are canvas-downscaled
to data URIs; export.js extracts data URIs into `img/` files in the ZIP and rewrites
references). Card icons: per-item `icon` select (`iconOptions`/`icons.pick` in
blocks.js, auto-rotation fallback when unset).

CTA safety: sales buy buttons carry `data-buy="ok|missing"`; the preview routes a
click on a `missing` button to the Publish tab and flashes the checkout field
(`setup-checkout` message → `checkoutHighlight`). The preview script intercepts ALL
non-hash link clicks — a relative URL would otherwise load the app itself inside the
srcdoc iframe (Vite SPA fallback). `extUrl()` (tokens.js) normalizes user-pasted
URLs (adds https://) everywhere they're consumed.

Config shape: `{ pageType, skin, brand: {name, primary, accent, tone, font}, optin, sales, site }`.
Layouts: `optin._layout` / `sales._layout` are `[{key, hidden?}]`;
`site._layout` is keyed per page (`home/about/services/contact`). For site, the
sidebar edits whichever page is active in the preview tabs (`sitePageKeys` maps
file → key). Sales `buyHref`: checkoutUrl when `settings.directCta` is on (or the
offer section is hidden/removed), else `#offer`; the checkout link is editable in
both the Offer section and the Publish tab (same `offer.checkoutUrl` value).
All three content trees are kept simultaneously so switching page
type is lossless. Persisted to localStorage key `buildrr:v1` (falls back to reading legacy `pagesmith:v1`) (mount-time save
deliberately skipped so an untouched second tab can't clobber another tab's save;
old saves without `_layout` get defaults via the per-pageType shallow merge).

## Conventions

- Exported pages must stay dependency-free vanilla HTML/CSS/JS (only Google Fonts
  as an external resource). `js/main.js` source lives in `src/templates/mainJs.js`.
- All user text goes through `esc()`/`rich()` from tokens.js (`rich` converts
  `*text*` → `<em class="hl">`, styled per skin).
- `.reveal` elements animate in via IntersectionObserver; reduced motion respected.
  Preview neutralizes reveals except via the "Play animations" button.
- Adding a skin: new entry in `skins.js` + thumb in `DesignPanel.jsx`.
- Adding a section: default content in `schema.js` defaults + a registry entry in
  `sections.js` (set `addon: true` unless it belongs in the default `_layout`).
  Old localStorage saves shallow-merge over defaults per page type, so new keys
  arrive automatically.

## Testing

No test suite. Quick smoke: `node scratchpad/test-export.mjs <outdir>` pattern —
generate all 9 pageType×skin combos via `buildFiles` in Node (it's DOM-free) and
serve with `python3 -m http.server` to eyeball.

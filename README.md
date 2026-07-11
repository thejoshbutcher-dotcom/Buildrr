# Buildrr

A landing page builder for people who've never built a website. Pick a page
type, pick a template style, swap in your brand colors, edit the copy, and
export a ZIP of plain HTML/CSS/JS you can upload anywhere.

## Run it

```bash
npm install
npm run dev      # Vite dev server → http://localhost:5173
npm run server   # (optional, separate terminal) Node API for Netlify publish → :8787
```

Open http://localhost:5173 — the marketing home page. The builder itself lives at /app (the big blue button takes you there). The editor, live preview, ZIP export, and single-HTML export all run 100% in the browser; the Node API is only needed for one-click Netlify publishing.

## Deploying Buildrr itself (Hostinger Node.js app)

The app is a static frontend plus a tiny Express API (`server/`) for the Netlify
publish flow. On Hostinger, host it as a **Node.js app**:

```bash
npm install
npm run build          # produces dist/
npm start              # serves dist/ + /api on $PORT (default 8787)
```

`server/index.js` serves the built `dist/` folder and the `/api/*` routes, with an
SPA fallback so `/app` works on direct load. Point `buildrr.io` at the Node app and
set the start command to `npm start` (after `npm run build`).

> The site works as pure static hosting too (just `dist/` + the included
> `.htaccess`) — you only lose the one-click Netlify publish button, which needs
> the server. Everything else (export ZIP, single-HTML, etc.) still works.

## Enabling one-click Netlify publish

The "Publish to Netlify" button needs a Netlify OAuth app. Until it's configured,
the Publish tab automatically falls back to the manual "Netlify Drop" instructions.

1. Create an OAuth app at **https://app.netlify.com/user/applications → New OAuth app**.
2. Set its **Redirect URI** to `https://buildrr.io/api/netlify/callback`
   (or `http://localhost:8787/api/netlify/callback` for local dev).
3. Copy `.env.example` → `.env` and fill in:
   - `NETLIFY_CLIENT_ID`
   - `NETLIFY_CLIENT_SECRET`
   - `NETLIFY_REDIRECT_URI` (must match the app's Redirect URI exactly)
4. Restart the server. The button becomes "Connect Netlify & publish".

All Netlify API calls happen server-side; the client secret and each user's access
token never reach the browser. Tokens are stored in `.data/sessions.json` keyed by
an httpOnly session cookie (swap `server/store.js` for a real DB in a multi-instance
setup).

## What it builds

Three page types, each with proven conversion structure and real starter copy:

- **Opt-in page** — lead-magnet squeeze page: hero + signup form, proof bar,
  "what you'll learn" checklist, host bio, closing CTA, thank-you page.
- **Sales page** — long-form sales letter with optional VSL embed (YouTube /
  Vimeo / .mp4), pain → method → benefits → testimonials → offer stack with
  value anchoring → guarantee → FAQ → final CTA.
- **Multi-page site** — Home / About / Services / Contact mini-site with
  shared nav, contact form, and thank-you page.

Three template styles (swap anytime — your copy and brand stay):

- **Editorial** — premium personal-brand look; serif display, marker highlights.
- **Impact** — high-energy launch look; block type, thick borders, offset shadows.
- **Lumen** — soft modern product look; pill buttons, gradient washes.

Brand controls: business name, primary + accent color (8 curated palettes or
custom hex), light/tinted/dark background tone, optional headline font override.
Wrap a phrase in `*asterisks*` in any headline to give it the style's highlight
treatment.

## Export

One click downloads `<brand>-<type>.zip`:

- `index.html` (+ `about.html`, `services.html`, `contact.html`, `thank-you.html` as applicable)
- `css/styles.css` — brand colors are CSS variables at the top
- `js/main.js` — scroll reveals, mobile nav, form handling; a few KB, no libraries
- `README.md` — one-minute deploy instructions (Netlify Drop, Vercel, GitHub
  Pages, classic FTP/cPanel) and how to wire forms to any provider

Forms post to whatever action URL you set (ConvertKit, Mailchimp,
formsubmit.co, custom). Left blank, they forward to the built-in thank-you
page so the flow still works.

Work is auto-saved to your browser's localStorage.

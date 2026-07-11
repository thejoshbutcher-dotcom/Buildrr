// Layout + component CSS shared by every skin. Skins restyle on top of this
// through the token variables and their own overrides.

export const baseCss = `
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img, video, iframe { max-width: 100%; display: block; }
a { color: inherit; }
h1, h2, h3, h4 {
  font-family: var(--font-display);
  line-height: 1.08;
  letter-spacing: var(--display-tracking, -0.02em);
  font-weight: var(--display-weight, 700);
  text-wrap: balance;
}
p { text-wrap: pretty; }

.container { width: min(1120px, 92vw); margin-inline: auto; }
.narrow { width: min(760px, 92vw); margin-inline: auto; }

section { padding-block: clamp(64px, 9vw, 112px); }
section.tight { padding-block: clamp(40px, 6vw, 64px); }
.alt-bg { background: var(--bg-alt); }

.eyebrow {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand);
  margin-bottom: 18px;
}
.section-head { max-width: 680px; margin-bottom: clamp(36px, 5vw, 56px); }
.section-head h2 { font-size: clamp(30px, 4.2vw, 46px); margin-bottom: 14px; }
.section-head p { color: var(--mut); font-size: 18px; }
.section-head.center { margin-inline: auto; text-align: center; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  border: none;
  border-radius: var(--btn-radius, 10px);
  background: var(--brand);
  color: var(--on-brand);
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  /* Keep the rounded corners clipped on a stable compositor layer: gradient
     backgrounds + border-radius drop their corner clip when a transform first
     promotes the element to its own layer (pills look square on hover). */
  transform: translateZ(0);
}
.btn:hover { transform: translateY(-2px) translateZ(0); }
.btn:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
.btn.big { padding: 19px 44px; font-size: 18px; }
.btn.ghost {
  background: transparent;
  color: var(--ink);
  box-shadow: inset 0 0 0 2px var(--line);
}
.btn-note { margin-top: 12px; font-size: 14px; color: var(--mut); }

/* Nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 16px;
}
.nav-brand {
  font-family: var(--font-display);
  font-weight: var(--display-weight, 700);
  font-size: 21px;
  text-decoration: none;
  letter-spacing: -0.01em;
}
.nav-logo { display: inline-flex; align-items: center; }
.nav-logo img { height: 38px; width: auto; max-width: 220px; display: block; }
.nav-links { display: flex; align-items: center; gap: 28px; list-style: none; padding: 0; }
.nav-links a { text-decoration: none; font-weight: 600; font-size: 15px; color: var(--mut); }
.nav-links a:hover, .nav-links a[aria-current="page"] { color: var(--ink); }
.nav-links .btn { padding: 11px 22px; font-size: 15px; color: var(--on-brand); }
.nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
.nav-toggle span { display: block; width: 22px; height: 2px; background: var(--ink); margin: 5px 0; transition: 0.2s; }

/* Hero */
.hero { padding-block: clamp(72px, 10vw, 132px); position: relative; overflow: hidden; }
.hero h1 { font-size: clamp(40px, 6.2vw, 72px); margin-bottom: 22px; }
.hero .lead { font-size: clamp(18px, 2vw, 21px); color: var(--mut); max-width: 620px; margin-bottom: 34px; }
.hero-split { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(40px, 6vw, 80px); align-items: center; }
.hero-center { text-align: center; }
.hero-center .lead { margin-inline: auto; }

/* Form card */
.form-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--card-radius, 16px);
  padding: clamp(26px, 3.4vw, 40px);
  box-shadow: var(--card-shadow, 0 20px 50px -24px rgb(0 0 0 / 0.25));
}
.form-card h3 { font-size: 24px; margin-bottom: 8px; }
.form-card .form-sub { color: var(--mut); font-size: 15px; margin-bottom: 22px; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
input[type="text"], input[type="email"], input[type="tel"], textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--line);
  border-radius: var(--btn-radius, 10px);
  background: var(--bg);
  color: var(--ink);
  font: inherit;
}
input::placeholder, textarea::placeholder { color: var(--mut); }
.form-card .btn { width: 100%; margin-top: 6px; }
.privacy-note { margin-top: 14px; font-size: 13px; color: var(--mut); text-align: center; }
.form-error { margin-top: 12px; font-size: 14px; font-weight: 600; color: #d33; text-align: center; }

/* Proof strip */
.proof { border-block: 1px solid var(--line); padding-block: 22px; }
.proof-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px 40px; }
.proof-item { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; color: var(--mut); }
.proof-item svg { color: var(--accent); flex: none; }

/* Feature / benefit cards */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--card-radius, 16px);
  padding: 30px 28px;
  box-shadow: var(--card-shadow, none);
}
.card h3 { font-size: 21px; margin: 16px 0 10px; }
.card p { color: var(--mut); font-size: 16px; }
.card-icon {
  width: 46px; height: 46px;
  display: grid; place-items: center;
  border-radius: var(--btn-radius, 10px);
  background: var(--brand-soft);
  color: var(--brand);
}

/* Checklist */
.checklist { list-style: none; padding: 0; display: grid; gap: 16px; }
.checklist li { display: flex; gap: 14px; align-items: flex-start; font-size: 17px; }
.checklist li strong { display: block; }
.check {
  flex: none; width: 26px; height: 26px; margin-top: 2px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: var(--brand); color: var(--on-brand);
}
.check svg { width: 14px; height: 14px; }

/* Quote / testimonials */
.quote-card { display: flex; flex-direction: column; gap: 18px; }
.quote-card blockquote { font-size: 17px; line-height: 1.55; }
.quote-who { display: flex; align-items: center; gap: 12px; margin-top: auto; }
.avatar {
  width: 44px; height: 44px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--accent-soft); color: var(--ink);
  font-weight: 800; font-size: 15px; letter-spacing: 0.02em;
}
.quote-who .who-name { font-weight: 700; font-size: 15px; }
.quote-who .who-role { color: var(--mut); font-size: 14px; }
.stars { color: var(--accent); letter-spacing: 2px; font-size: 15px; }

/* Numbered steps */
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; counter-reset: step; }
.step { counter-increment: step; }
.step::before {
  content: counter(step, decimal-leading-zero);
  display: block;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 800;
  color: var(--brand);
  margin-bottom: 12px;
}
.step h3 { font-size: 20px; margin-bottom: 8px; }
.step p { color: var(--mut); font-size: 16px; }

/* Offer stack */
.offer-box {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--card-radius, 16px);
  box-shadow: var(--card-shadow, 0 30px 70px -30px rgb(0 0 0 / 0.3));
  overflow: hidden;
}
.offer-head { padding: 30px 36px; background: var(--brand); color: var(--on-brand); }
.offer-head h3 { font-size: 26px; }
.offer-list { list-style: none; margin: 0; padding: 14px 36px; }
.offer-list li {
  display: flex; justify-content: space-between; gap: 18px;
  padding-block: 15px; border-bottom: 1px solid var(--line);
  font-size: 16.5px;
}
.offer-list li:last-child { border-bottom: none; }
.offer-list .value { color: var(--mut); font-weight: 600; white-space: nowrap; }
.offer-cta { padding: 28px 36px 36px; text-align: center; border-top: 1px solid var(--line); background: var(--shade); }
.price-line { display: flex; align-items: baseline; justify-content: center; gap: 12px; margin-bottom: 6px; }
.price { font-family: var(--font-display); font-size: 54px; font-weight: 800; letter-spacing: -0.02em; }
.price-was { color: var(--mut); text-decoration: line-through; font-size: 20px; }
.price-note { color: var(--mut); font-size: 15px; margin-bottom: 22px; }

/* Guarantee */
.guarantee {
  display: flex; gap: 24px; align-items: flex-start;
  background: var(--shade);
  border: 1px dashed color-mix(in oklab, var(--brand) 45%, transparent);
  border-radius: var(--card-radius, 16px);
  padding: clamp(24px, 3.4vw, 38px);
}
.guarantee-badge {
  flex: none; width: 64px; height: 64px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--brand); color: var(--on-brand);
}
.guarantee h3 { font-size: 22px; margin-bottom: 8px; }
.guarantee p { color: var(--mut); }

/* FAQ */
.faq { display: grid; gap: 12px; }
.faq details {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--card-radius, 16px);
  padding: 4px 24px;
}
.faq summary {
  cursor: pointer;
  list-style: none;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding-block: 18px;
  font-weight: 700; font-size: 17px;
  font-family: var(--font-body);
}
.faq summary::-webkit-details-marker { display: none; }
.faq summary::after { content: "+"; font-size: 22px; color: var(--brand); transition: transform 0.2s; flex: none; }
.faq details[open] summary::after { transform: rotate(45deg); }
.faq details p { padding-bottom: 20px; color: var(--mut); }

/* Video embed */
.video-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--card-radius, 16px);
  overflow: hidden;
  background: #000;
  box-shadow: var(--card-shadow, 0 34px 80px -30px rgb(0 0 0 / 0.45));
}
.video-frame iframe, .video-frame video { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

/* CTA band */
.cta-band { background: var(--brand); color: var(--on-brand); text-align: center; }
.cta-band h2 { font-size: clamp(30px, 4.4vw, 48px); margin-bottom: 14px; }
.cta-band p { opacity: 0.85; max-width: 560px; margin: 0 auto 30px; font-size: 18px; }
.cta-band .btn { background: var(--on-brand); color: var(--brand); }
.cta-band .btn-note { color: inherit; opacity: 0.75; }

/* Footer */
footer { border-top: 1px solid var(--line); padding-block: 34px; }
.footer-inner {
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;
  font-size: 14px; color: var(--mut);
}
.footer-inner a { color: inherit; }
.footer-brand { font-family: var(--font-display); font-weight: var(--display-weight, 700); font-size: 17px; color: var(--ink); }

/* Section background images */
.has-bg { position: relative; }
.sec-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  pointer-events: none;
}
.has-bg > *:not(.sec-bg) { position: relative; z-index: 1; }

/* Image with Text (two column). Media is first in the DOM (= left by default);
   media-right pushes it to the second column. */
.imgtext { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 5vw, 64px); align-items: center; }
.imgtext.media-right .imgtext-media { order: 2; }
.imgtext-media img { width: 100%; border-radius: var(--card-radius, 16px); object-fit: cover; }
.imgtext-media .img-ph { aspect-ratio: 4 / 3; }
.imgtext-body h2 { font-size: clamp(26px, 3.6vw, 40px); margin-bottom: 14px; }
.imgtext-body p { color: var(--mut); font-size: 18px; margin-bottom: 24px; }
@media (max-width: 760px) {
  .imgtext { grid-template-columns: 1fr; }
  .imgtext.media-right .imgtext-media { order: 0; } /* image on top on mobile */
}

/* Product image above the offer box (width set inline by the size slider) */
.offer-image {
  display: block;
  max-width: 100%;
  margin: 0 auto clamp(24px, 4vw, 38px);
  border-radius: var(--card-radius, 16px);
  object-fit: cover;
}

/* Bio photo + image block */
.bio-photo { width: 64px; height: 64px; flex: none; object-fit: cover; }
.image-block img { width: 100%; border-radius: var(--card-radius, 16px); }
.image-block figcaption { text-align: center; color: var(--mut); font-size: 14px; margin-top: 12px; }
.img-ph {
  aspect-ratio: 16 / 7;
  border-radius: var(--card-radius, 16px);
  display: grid; place-items: center;
  background: var(--shade); color: var(--mut);
  border: 1.5px dashed var(--line);
  font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase;
}

/* Reveal animations (main.js flips .in) */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1); }
.reveal.in { opacity: 1; transform: none; }
.reveal.d1 { transition-delay: 0.08s; }
.reveal.d2 { transition-delay: 0.16s; }
.reveal.d3 { transition-delay: 0.24s; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .btn { transition: none; }
}

/* Responsive */
@media (max-width: 920px) {
  .hero-split { grid-template-columns: 1fr; }
  .grid-3, .steps { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .grid-3, .grid-2, .steps { grid-template-columns: 1fr; }
  .nav-toggle { display: block; }
  .nav-links {
    display: none;
    position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; align-items: flex-start;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
    padding: 18px 4vw 24px;
    gap: 18px;
  }
  .nav-links.open { display: flex; }
  .offer-list { padding-inline: 22px; }
  .offer-head, .offer-cta { padding-inline: 22px; }
  .guarantee { flex-direction: column; }
}
`

// Page types: default content (including add-on sections), default section
// layouts, and the pinned editor groups that sit outside the section list.
// Section-specific field schemas live in src/templates/sections.js.
//
// Field types: text, textarea, url, toggle, items (repeatable group).

export const pageTypes = {
  optin: { label: 'Opt-in Page', short: 'Opt-in' },
  sales: { label: 'Sales Page', short: 'Sales' },
  site: { label: 'Multi-page Site', short: 'Site' },
}

export const defaults = {
  brand: {
    name: 'Brightline',
    logo: '',
    primary: '#1f3a8a',
    accent: '#f59e0b',
    tone: 'light',
    font: 'default',
  },

  optin: {
    _layout: [{ key: 'hero' }, { key: 'proof' }, { key: 'learn' }, { key: 'host' }, { key: 'cta' }],
    hero: {
      eyebrow: 'Free 5-day email course',
      headline: 'Turn your first 1,000 subscribers into your *best customers*',
      subhead:
        'The exact list-building system I used to go from zero to a six-figure launch — broken into five short daily lessons you can act on in under 20 minutes.',
      formTitle: 'Get instant access',
      formSub: 'Lesson one lands in your inbox two minutes from now.',
      ctaLabel: 'Send me lesson one',
      privacy: 'Free forever. No spam. Unsubscribe in one click.',
    },
    proof: {
      items: [
        { text: '4,800+ students enrolled' },
        { text: 'Rated 4.9/5 by past students' },
        { text: 'Featured in Creator Weekly' },
      ],
    },
    learn: {
      eyebrow: 'Inside the course',
      title: 'What you’ll learn in 5 days',
      bullets: [
        { strong: 'Day 1 — The one-line promise.', text: 'Position your list so the right people can’t not subscribe.' },
        { strong: 'Day 2 — The 20-minute lead magnet.', text: 'Build something people actually want, without a designer.' },
        { strong: 'Day 3 — Your evergreen traffic loop.', text: 'Three free channels that compound while you sleep.' },
        { strong: 'Day 4 — The welcome sequence.', text: 'Five emails that turn a cold signup into a warm fan.' },
        { strong: 'Day 5 — Your first paid offer.', text: 'How to make your first sales without feeling salesy.' },
      ],
    },
    host: {
      name: 'Jordan Avery',
      role: 'Creator of the List Launch method',
      bio: 'I’ve spent eight years building email lists for bootstrapped founders — including two of my own past 40,000 subscribers. Everything in this course is what I still do today, minus the trial and error.',
      image: '',
    },
    imageBlock: { image: '', caption: '' },
    imageText: {
      title: 'A lead magnet people actually finish',
      text: 'This isn’t another 50-page PDF that dies in your downloads folder. It’s five short lessons, one small action each — designed so you reach the end and have something real to show for it.',
      buttonLabel: 'Get the free course',
      buttonUrl: '',
      image: '',
      side: 'right',
    },
    steps: {
      eyebrow: 'How it works',
      title: 'Three steps to your first 1,000',
      items: [
        { title: 'Sign up free', text: 'Drop your email and lesson one arrives within two minutes.' },
        { title: 'One lesson a day', text: 'Each lesson is under 20 minutes of reading and one concrete action.' },
        { title: 'Launch by Friday', text: 'Finish the week with your lead magnet live and your first subscribers in.' },
      ],
    },
    testimonials: {
      eyebrow: 'Student results',
      title: 'What past students say',
      items: [
        { quote: 'I went from 0 to 600 subscribers in three weeks using just the Day 3 traffic loop.', name: 'Casey Nguyen', role: 'Food blogger' },
        { quote: 'The welcome sequence template alone doubled my reply rate. Best free course I’ve taken.', name: 'Leah Brooks', role: 'Fitness coach' },
        { quote: 'Short, zero fluff, and I actually finished it — then sold my first digital product a month later.', name: 'Marcus Webb', role: 'Woodworker' },
      ],
    },
    faq: {
      title: 'Quick questions',
      items: [
        { q: 'Is it really free?', a: 'Completely. Five lessons, no upsell mid-course, unsubscribe any time.' },
        { q: 'How much time does each lesson take?', a: 'Under 20 minutes including the action step. It’s built for busy people.' },
        { q: 'I don’t have anything to sell yet — is it still useful?', a: 'That’s the best time to start. You’ll build the audience your future offer needs.' },
      ],
    },
    video: {
      eyebrow: 'Sneak peek',
      title: 'Watch: inside lesson one',
      videoUrl: '',
    },
    capture: { destination: 'thanks', actionUrl: '', email: '', customAjax: false },
    publish: { netlifySiteId: '', netlifyUrl: '' },
    settings: {
      formAction: '',
      footerNote: 'You’re one good email list away.',
    },
  },

  sales: {
    _layout: [
      { key: 'hero' },
      { key: 'proof' },
      { key: 'pain' },
      { key: 'how' },
      { key: 'benefits' },
      { key: 'testimonials' },
      { key: 'offer' },
      { key: 'guarantee' },
      { key: 'faq' },
      { key: 'final' },
    ],
    hero: {
      eyebrow: 'Enrollment open through Friday',
      headline: 'Launch your online course to *$10k in 30 days* — without an audience of thousands',
      subhead:
        'Launch OS is the complete system — strategy, templates, and tech — that has powered 1,200+ first launches. Watch the free training below to see exactly how it works.',
      showVideo: true,
      videoUrl: '',
      ctaLabel: 'Enroll in Launch OS',
      ctaNote: 'One-time payment · Lifetime access · 30-day guarantee',
    },
    proof: {
      items: [
        { text: '1,200+ successful launches' },
        { text: '$4.3M in student results' },
        { text: '30-day money-back guarantee' },
      ],
    },
    pain: {
      eyebrow: 'Sound familiar?',
      title: 'You don’t have a course problem. You have a launch problem.',
      items: [
        { strong: 'You’ve been “almost ready” for months.', text: 'The course is 80% done, but the launch plan is a blank page.' },
        { strong: 'Your last launch was crickets.', text: 'Three sales — two of them friends. The problem wasn’t your offer.' },
        { strong: 'The tech maze is eating your weekends.', text: 'Funnels, emails, checkout pages — duct-taped together, breaking often.' },
      ],
    },
    how: {
      eyebrow: 'The method',
      title: 'Three phases. Thirty days. One repeatable system.',
      steps: [
        { title: 'Position', text: 'Nail the promise and price of your offer with our validation framework — before you write a single email.' },
        { title: 'Prime', text: 'Warm up your audience in 14 days with the exact content calendar and email scripts our top students use.' },
        { title: 'Launch', text: 'Run a proven 7-day open-close launch with every page, email, and follow-up already templated.' },
      ],
    },
    benefits: {
      eyebrow: 'What’s inside',
      title: 'Everything you need to launch — nothing you don’t',
      items: [
        { title: '6-module core program', text: 'Step-by-step video lessons that take you from idea to open cart in 30 days flat.' },
        { title: 'The complete swipe vault', text: '42 launch emails, 12 landing pages, and every social post — written for you.' },
        { title: 'Tech setup, decoded', text: 'Click-along tutorials for the exact stack we use. No developer needed.' },
        { title: 'Weekly live coaching', text: 'Get unstuck fast with weekly Q&A calls and a private student community.' },
      ],
    },
    testimonials: {
      eyebrow: 'Student results',
      title: 'People who launched with this exact system',
      items: [
        { quote: 'I followed the calendar day by day and closed my first launch at $14,200. I still can’t quite believe I get to say that.', name: 'Maya Torres', role: 'Watercolor instructor' },
        { quote: 'The swipe files alone are worth the price. I launched in 26 days after sitting on a finished course for over a year.', name: 'Dan Okafor', role: 'Guitar teacher' },
        { quote: 'Second launch: $31k with a list of 900 people. It’s not about list size — the sequencing genuinely works.', name: 'Priya Shah', role: 'Career coach' },
      ],
    },
    offer: {
      eyebrow: 'The offer',
      title: 'Everything you get when you join today',
      image: '',
      imageWidth: 60,
      boxTitle: 'Launch OS — Complete System',
      items: [
        { name: 'Launch OS core program (6 modules)', value: '$1,997 value' },
        { name: 'Swipe vault: 42 emails + 12 page templates', value: '$697 value' },
        { name: 'Tech setup click-along library', value: '$297 value' },
        { name: '12 months of weekly live coaching', value: '$1,164 value' },
        { name: 'Private student community', value: 'Priceless' },
      ],
      price: '$497',
      priceWas: '$997',
      priceNote: 'One-time payment. Lifetime access, including all future updates.',
      ctaLabel: 'Enroll now — instant access',
      checkoutUrl: '',
    },
    guarantee: {
      title: 'The “launch it or don’t pay” guarantee',
      text: 'Go through the program, use the templates, and run your launch. If you don’t make back at least your investment within 30 days of open cart, email us your work and we’ll refund every penny — and you keep the swipe vault.',
    },
    faq: {
      title: 'Questions, answered',
      items: [
        { q: 'I don’t have an audience yet. Will this work for me?', a: 'Yes — Phase 1 includes our audience seeding sprint. Most students launch to lists of 300–1,000 people; the system is built for small, warm audiences, not influencer followings.' },
        { q: 'How much time does it take each week?', a: 'Plan for 4–6 focused hours a week for 30 days. Every task comes with a template, so you’re executing, not staring at blank pages.' },
        { q: 'My course isn’t finished. Should I wait?', a: 'No — we teach a pre-sell launch so you validate and get paid before you finish building. Many students finish their course with their first students inside it.' },
        { q: 'What if it doesn’t work for me?', a: 'That’s what the guarantee is for. Do the work, and if your launch doesn’t recoup your investment in 30 days, you get a full refund.' },
        { q: 'How long do I keep access?', a: 'Forever. One payment, lifetime access, and every future update to the program is included.' },
      ],
    },
    final: {
      title: 'Your course deserves a real launch',
      text: 'Join 1,200+ creators who stopped waiting for “ready” and followed the system instead.',
      ctaLabel: 'Enroll in Launch OS',
      ctaNote: 'Doors close Friday at midnight',
    },
    author: {
      eyebrow: 'Your instructor',
      name: 'Jordan Avery',
      role: 'Founder of Launch OS · 8 years, 1,200+ launches',
      bio: 'I’ve run launches for bootstrapped creators since 2018 — from $2k first launches to $400k relaunches. Launch OS is the system I wish someone had handed me at the start: every template, every email, every decision already made.',
      image: '',
    },
    imageBlock: { image: '', caption: '' },
    imageText: {
      title: 'See exactly what you’re getting',
      text: 'Every module, template, and swipe file laid out plainly. No vague promises — just the full system you’ll use to plan, prime, and run your launch from day one to cart close.',
      buttonLabel: 'Enroll now',
      buttonUrl: '',
      image: '',
      side: 'left',
    },
    checklist: {
      eyebrow: 'The outcome',
      title: 'By the end of 30 days, you’ll have…',
      bullets: [
        { strong: 'A validated offer', text: 'priced with real data, not guesswork.' },
        { strong: 'A warm, primed audience', text: 'that has been waiting for cart open since week two.' },
        { strong: 'Every page and email live', text: 'sales page, checkout, and a 7-day launch sequence — all templated.' },
        { strong: 'Your first (or best) launch done', text: 'and a repeatable system you can run again next quarter.' },
      ],
    },
    video: {
      eyebrow: 'See it in action',
      title: 'A look inside Launch OS',
      videoUrl: '',
    },
    publish: { netlifySiteId: '', netlifyUrl: '' },
    settings: { footerNote: 'Results shown are real student outcomes; individual results vary.', directCta: false },
  },

  site: {
    _layout: {
      home: [{ key: 'hero' }, { key: 'services' }, { key: 'about' }, { key: 'cta' }],
      about: [{ key: 'hero' }, { key: 'story' }, { key: 'values' }, { key: 'founder' }, { key: 'cta' }],
      services: [{ key: 'hero' }, { key: 'list' }, { key: 'cta' }],
      contact: [{ key: 'hero' }],
    },
    global: {
      tagline: 'A brand & web studio for small teams with big ambitions.',
      ctaLabel: 'Book a free intro call',
    },
    home: {
      hero: {
        eyebrow: 'Brand & web studio',
        headline: 'Websites that make small companies *look unmistakable*',
        subhead: 'We design and ship brands, websites, and launch campaigns for founders who care how things feel — in weeks, not quarters.',
      },
      services: {
        eyebrow: 'What we do',
        title: 'Three ways we can help',
        items: [
          { title: 'Brand identity', text: 'Naming, logo, voice, and a system your team can actually use day to day.' },
          { title: 'Website design & build', text: 'A fast, beautiful marketing site — designed, written, and shipped in 3 weeks.' },
          { title: 'Launch campaigns', text: 'Landing pages, email flows, and creative for your next product moment.' },
        ],
      },
      about: {
        eyebrow: 'The studio',
        title: 'Small on purpose',
        text: 'We’re a two-person studio, which means the people you meet on the first call are the people doing the work. No account managers, no hand-offs, no telephone game — just senior work, close collaboration, and opinions we’ll defend.',
      },
      testimonial: {
        quote: 'They rebuilt our brand and site in five weeks and inbound leads doubled the following quarter. Best money we’ve spent as a company, full stop.',
        name: 'Elena Ruiz',
        role: 'Founder, Fieldnote Coffee',
      },
    },
    about: {
      hero: {
        eyebrow: 'About us',
        headline: 'The two of us, and how we work',
        subhead: 'Brightline is run by a designer and a writer who got tired of watching small companies get big-agency treatment: slow, expensive, and forgettable.',
      },
      story:
        'We started Brightline after a decade inside agencies, where the best ideas routinely died in slide decks. Our fix was to stay small and go deep: a handful of clients a year, senior people only, and a bias for shipping. Since 2019 we’ve launched 60+ brands and websites for founders in food, fitness, software, and the trades.\n\nEvery engagement runs the same way: a sharp strategy week, an honest design phase with real copy from day one, and a build that’s live before the momentum fades.',
      values: {
        title: 'What we optimize for',
        items: [
          { title: 'Ship fast, ship right', text: 'Weeks-long timelines, not quarters. Momentum is a feature.' },
          { title: 'Words first', text: 'Design without a message is decoration. We write before we draw.' },
          { title: 'Own the outcome', text: 'We measure our work by your leads and sales, not by awards.' },
        ],
      },
      founder: {
        name: 'Sam & Rae Calloway',
        role: 'Partners, Brightline Studio',
        bio: 'Sam leads design; Rae leads strategy and copy. Between them: 24 years, 60+ launches, and one strongly held belief — clarity beats clever.',
        image: '',
      },
    },
    services: {
      hero: {
        eyebrow: 'Services',
        headline: 'Pick the engagement that fits',
        subhead: 'Fixed scope, fixed price, fixed timeline. You’ll know exactly what you get and when you get it.',
      },
      items: [
        {
          title: 'Brand identity',
          price: 'from $6,500',
          text: 'For new companies or tired brands. In three weeks you get a complete identity your team can run with.',
          includes: 'Strategy & positioning workshop\nLogo suite & color system\nType, voice & usage guidelines\nSocial & template kit',
        },
        {
          title: 'Website design & build',
          price: 'from $9,500',
          text: 'A marketing site that loads fast, reads clearly, and converts. Copy included — we write every word with you.',
          includes: 'Sitemap & messaging architecture\nCustom design, desktop to mobile\nCopywriting for every page\nBuilt, tested & launched for you',
        },
        {
          title: 'Launch campaign',
          price: 'from $4,500',
          text: 'For a product moment that matters. We build the landing page and the campaign that fills it.',
          includes: 'Launch landing page\nEmail sequence (5–7 sends)\nAd & social creative kit\nAnalytics & post-launch report',
        },
      ],
    },
    contact: {
      hero: {
        eyebrow: 'Contact',
        headline: 'Tell us what you’re building',
        subhead: 'Send a few lines about your company and timing. We reply to every note within one business day.',
      },
      email: 'hello@brightline.studio',
      phone: '(555) 014-2288',
      location: 'Portland, OR — working worldwide',
      formAction: '',
    },
    // Shared add-on content — the same section can be placed on several pages
    // and always reads (and edits) this one copy.
    proof: {
      items: [{ text: '60+ brands launched since 2019' }, { text: 'Average 3-week turnaround' }, { text: '92% of clients come back' }],
    },
    testimonials: {
      eyebrow: 'Kind words',
      title: 'What clients say',
      items: [
        { quote: 'They rebuilt our brand and site in five weeks and inbound leads doubled the next quarter.', name: 'Elena Ruiz', role: 'Founder, Fieldnote Coffee' },
        { quote: 'The only agency experience I’ve had where the work shipped on the day they said it would.', name: 'Tom Hale', role: 'CEO, Hale Electrical' },
        { quote: 'Our new site says in five seconds what we used to explain in five slides.', name: 'Dana Whitfield', role: 'Founder, Whitfield Legal' },
      ],
    },
    steps: {
      eyebrow: 'The process',
      title: 'How we work',
      items: [
        { title: 'Strategy week', text: 'One focused week to nail positioning, message, and scope — together.' },
        { title: 'Design & copy', text: 'Real copy from day one, honest reviews, no big-reveal theatrics.' },
        { title: 'Build & launch', text: 'We ship it, test it, and hand you the keys with everything documented.' },
      ],
    },
    faq: {
      title: 'Common questions',
      items: [
        { q: 'How long does a typical project take?', a: 'Brand identity runs three weeks; a full website runs three to five. We only take on work we can start within a month.' },
        { q: 'Do you work with companies outside the US?', a: 'Yes — about a third of our clients are overseas. We overlap at least four working hours with every timezone we take on.' },
        { q: 'What does it cost?', a: 'Engagements are fixed-price and start at $4,500. You’ll have an exact number after the intro call, before any commitment.' },
      ],
    },
    imageBlock: { image: '', caption: '' },
    imageText: {
      title: 'Design that earns its keep',
      text: 'We don’t make things pretty for the sake of it. Every choice — a headline, a color, a layout — is there to help the right customer understand you faster and act sooner.',
      buttonLabel: 'Book a free intro call',
      buttonUrl: '',
      image: '',
      side: 'right',
    },
    capture: { destination: 'thanks', actionUrl: '', email: '', customAjax: false },
    publish: { netlifySiteId: '', netlifyUrl: '' },
    settings: { footerNote: '' },
  },
}

// ---- Field helpers (shared with src/templates/sections.js) ---------------

export const t = (path, label, help) => ({ type: 'text', path, label, help })
export const ta = (path, label, help) => ({ type: 'textarea', path, label, help })
export const url = (path, label, help) => ({ type: 'url', path, label, help })
export const img = (path, label, help) => ({ type: 'image', path, label, help })

// ---- Pinned editor groups (not sections; can't move/hide) -----------------

export const pinnedSchemas = {
  optin: {
    top: [],
    bottom: [{ group: 'Settings', fields: [t('settings.footerNote', 'Footer note')] }],
  },
  sales: {
    top: [],
    bottom: [{ group: 'Settings', fields: [t('settings.footerNote', 'Footer note')] }],
  },
  site: {
    top: [{ group: 'Global', fields: [t('global.tagline', 'Tagline'), t('global.ctaLabel', 'Main button label')] }],
    bottom: [
      {
        group: 'Settings',
        fields: [
          t('contact.email', 'Email'),
          t('contact.phone', 'Phone'),
          t('contact.location', 'Location'),
          t('settings.footerNote', 'Footer note'),
        ],
      },
    ],
  },
}

export function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
}

export function setIn(obj, path, value) {
  const keys = path.split('.')
  const clone = structuredClone(obj)
  let cur = clone
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]]
  cur[keys[keys.length - 1]] = value
  return clone
}

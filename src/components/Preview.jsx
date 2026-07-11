import React from 'react'
import { buildFiles } from '../templates/build.js'

// Injected only into preview HTML. Three jobs:
//  1. Inline editing: every [data-edit] element becomes contenteditable;
//     typed text is serialized back to its config path and posted up.
//  2. Section focus: clicking a section (or its text) tells the builder to
//     open that section's editor group.
//  3. Route internal link clicks / demo form submits up to the builder
//     instead of navigating the iframe.
const previewScript = `<script>
(function () {
  var st = document.createElement("style");
  st.textContent =
    "[data-edit]{cursor:text;transition:box-shadow .12s ease}" +
    "[data-edit]:hover{box-shadow:0 0 0 2px rgba(46,123,255,.35);border-radius:4px}" +
    "[data-edit]:focus{outline:none;box-shadow:0 0 0 2px #2e7bff;border-radius:4px;background:rgba(46,123,255,.05)}";
  document.head.appendChild(st);

  document.querySelectorAll("[data-edit]").forEach(function (el) {
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "false");
  });

  function secOf(el) {
    var s = el.closest("[data-sec]");
    return s ? s.getAttribute("data-sec") : null;
  }

  function serialize(el) {
    if (el.hasAttribute("data-edit-ml")) return el.innerText.replace(/\\n{3,}/g, "\\n\\n").trim();
    if (el.hasAttribute("data-edit-rich")) {
      var out = "";
      el.childNodes.forEach(function (n) {
        if (n.nodeType === 3) out += n.textContent;
        else if (n.nodeType === 1 && n.classList && n.classList.contains("hl")) out += "*" + n.textContent + "*";
        else if (n.nodeType === 1) out += n.textContent;
      });
      return out.replace(/\\s+/g, " ").trim();
    }
    return el.innerText.replace(/\\s+/g, " ").trim();
  }

  var editTimer = null;
  function postEdit(el) {
    parent.postMessage({ buildrr: "edit", path: el.getAttribute("data-edit"), value: serialize(el) }, "*");
  }

  document.addEventListener("focusin", function (e) {
    if (e.target.closest && e.target.closest("[data-edit]")) {
      parent.postMessage({ buildrr: "editing", active: true }, "*");
    }
  });
  document.addEventListener("focusout", function (e) {
    var el = e.target.closest && e.target.closest("[data-edit]");
    if (el) {
      clearTimeout(editTimer);
      postEdit(el);
      parent.postMessage({ buildrr: "editing", active: false }, "*");
    }
  });
  document.addEventListener("input", function (e) {
    var el = e.target.closest && e.target.closest("[data-edit]");
    if (!el) return;
    clearTimeout(editTimer);
    editTimer = setTimeout(function () { postEdit(el); }, 400);
  });
  // Preview-only demo submit: the iframe sandbox has no allow-forms, so a form
  // can never actually navigate. We surface the intended result ourselves.
  function formIntent(form) {
    if (!form) return;
    var mode = form.getAttribute("data-capture") || "thanks";
    var thanks = form.getAttribute("data-thanks") || "thank-you.html";
    if (mode === "thanks") parent.postMessage({ buildrr: "nav", page: thanks }, "*");
    else parent.postMessage({ buildrr: "form", mode: mode }, "*");
  }

  document.addEventListener("keydown", function (e) {
    var el = e.target.closest && e.target.closest("[data-edit]");
    if (el && e.key === "Enter" && !el.hasAttribute("data-edit-ml")) {
      e.preventDefault();
      el.blur();
      return;
    }
    // Enter inside a demo form field shows the thank-you result.
    if (e.key === "Enter") {
      var field = e.target.closest && e.target.closest("[data-form] input");
      if (field) { e.preventDefault(); formIntent(field.closest("[data-form]")); }
    }
  });
  document.addEventListener("paste", function (e) {
    var el = e.target.closest && e.target.closest("[data-edit]");
    if (!el) return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  });

  document.addEventListener("click", function (e) {
    // A buy button with no checkout link: send the user to the Publish tab
    // so they can wire it up — that click can't do anything useful here.
    var buy = e.target.closest('[data-buy="missing"]');
    if (buy) {
      e.preventDefault();
      parent.postMessage({ buildrr: "setup-checkout" }, "*");
      return;
    }
    var editable = e.target.closest("[data-edit]");
    if (editable) {
      // Editing wins over navigation / form submit / FAQ toggle.
      if (editable.closest("a, button, summary")) e.preventDefault();
      var k = secOf(editable);
      if (k) parent.postMessage({ buildrr: "sec", key: k }, "*");
      return;
    }
    var a = e.target.closest("a");
    if (a) {
      var href = a.getAttribute("href") || "";
      // ALWAYS prevent: this doc is about:srcdoc with base /app, so even a "#id"
      // link resolves to /app#id and would load the builder inside the iframe.
      e.preventDefault();
      if (href.charAt(0) === "#") {
        var tgt = href.length > 1 && document.getElementById(href.slice(1));
        if (tgt) tgt.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (href.endsWith(".html")) parent.postMessage({ buildrr: "nav", page: href }, "*");
      else if (/^https?:/i.test(href)) parent.postMessage({ buildrr: "external", url: href }, "*");
      else if (href) parent.postMessage({ buildrr: "external", url: "https://" + href.replace(/^\\/+/, "") }, "*");
      return;
    }
    var sec = e.target.closest("[data-sec]");
    if (sec) parent.postMessage({ buildrr: "sec", key: sec.getAttribute("data-sec") }, "*");
  }, true);

  document.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation(); // don't let the inlined main.js also submit (no real network calls in preview)
    var form = e.target;
    var mode = form.getAttribute("data-capture") || "thanks";
    var thanks = form.getAttribute("data-thanks") || "thank-you.html";
    if (mode === "thanks") parent.postMessage({ buildrr: "nav", page: thanks }, "*");
    else parent.postMessage({ buildrr: "form", mode: mode }, "*");
  }, true);
})();
</script>`

const noAnimStyle = '<style>.reveal{opacity:1!important;transform:none!important;transition:none!important}</style>'

// Friendly description of what a form submit does on the live site.
function captureBlurb(capture) {
  switch (capture?.destination) {
    case 'netlify':
      return 'Captured by Netlify Forms once deployed to Netlify'
    case 'kit':
      return 'Sends to ConvertKit, then shows your thank-you page'
    case 'mailchimp':
      return 'Sends to Mailchimp (shows Mailchimp’s confirmation) on your live site'
    case 'mailerlite':
      return 'Sends to MailerLite (shows its confirmation) on your live site'
    case 'formsubmit':
      return 'Emailed to you via FormSubmit, then shows your thank-you page'
    case 'custom':
      return capture.customAjax
        ? 'Posts to your endpoint, then shows your thank-you page'
        : 'Posts to your endpoint on your live site'
    default:
      return 'Shows your thank-you page on the exported site'
  }
}

function useDebounced(value, ms) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function Preview({ config, device, activePage, setActivePage, toast, onEdit, onSectionFocus, onSetupCheckout }) {
  const debounced = useDebounced(config, 350)
  const iframeRef = React.useRef(null)
  const scrollMemo = React.useRef({})
  const [animKey, setAnimKey] = React.useState(0)
  const [animate, setAnimate] = React.useState(false)

  const built = React.useMemo(() => buildFiles(debounced, { preview: true, previewScript }), [debounced])
  const page = built.files[activePage] ? activePage : 'index.html'
  const html = animate ? built.files[page] : built.files[page].replace('</head>', `${noAnimStyle}</head>`)

  // While the user types inline in the preview, regenerating the iframe would
  // destroy their cursor — freeze the srcdoc and re-sync after they blur.
  const [editing, setEditing] = React.useState(false)
  const unfreezeTimer = React.useRef(null)
  const [displayHtml, setDisplayHtml] = React.useState(html)
  React.useEffect(() => {
    if (!editing) setDisplayHtml(html)
  }, [html, editing])

  // Content edits regenerate with animations off so the page doesn't flicker.
  React.useEffect(() => {
    if (animate) setAnimate(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  React.useEffect(() => {
    function onMessage(e) {
      const d = e.data
      if (!d || !d.buildrr) return
      if (d.buildrr === 'nav') {
        if (built.files[d.page]) {
          scrollMemo.current[d.page] = 0
          setActivePage(d.page)
        }
      } else if (d.buildrr === 'external') {
        toast(`Links to ${d.url} — opens normally on the exported site`)
      } else if (d.buildrr === 'form') {
        toast(captureBlurb(config[config.pageType]?.capture))
      } else if (d.buildrr === 'edit') {
        onEdit(d.path, d.value)
      } else if (d.buildrr === 'editing') {
        clearTimeout(unfreezeTimer.current)
        // Unfreezing waits for the config debounce so the reload happens once,
        // with the final text.
        if (d.active) setEditing(true)
        else unfreezeTimer.current = setTimeout(() => setEditing(false), 600)
      } else if (d.buildrr === 'sec') {
        onSectionFocus(d.key)
      } else if (d.buildrr === 'setup-checkout') {
        onSetupCheckout()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [built, setActivePage, toast, onEdit, onSectionFocus, onSetupCheckout, config])

  const onLoad = () => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    try {
      win.scrollTo(0, scrollMemo.current[page] || 0)
      win.addEventListener('scroll', () => {
        scrollMemo.current[page] = win.scrollY
      })
    } catch {
      /* cross-origin guard; srcdoc is same-origin so this shouldn't happen */
    }
  }

  const playAnimations = () => {
    scrollMemo.current[page] = 0
    setAnimate(true)
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="workspace">
      <div className="ws-toolbar">
        {built.pages.length > 1 && (
          <div className="page-tabs" role="tablist" aria-label="Pages">
            {built.pages.map((p) => (
              <button key={p.file} className={p.file === page ? 'on' : ''} onClick={() => setActivePage(p.file)}>
                {p.title}
              </button>
            ))}
          </div>
        )}
        <div className="right">
          <span className="edit-hint">Click any text in the preview to edit it</span>
          <button className="btn-quiet" onClick={playAnimations} title="Replay the scroll-reveal animations from the top">
            ▶ Play animations
          </button>
        </div>
      </div>
      <div className="artboard">
        <div className={`frame-wrap ${device === 'mobile' ? 'mobile' : ''}`}>
          <div className="frame">
            {/* No allow-forms: a srcdoc form action resolves against /app and would
                load the builder inside the iframe. The preview script drives the
                demo submit from click/keydown instead. */}
            <iframe key={`${page}-${animKey}`} ref={iframeRef} title="Page preview" srcDoc={displayHtml} onLoad={onLoad} sandbox="allow-scripts allow-same-origin" />
          </div>
        </div>
      </div>
    </div>
  )
}

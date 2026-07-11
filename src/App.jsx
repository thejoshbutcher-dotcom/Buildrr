import React from 'react'
import { defaults, pinnedSchemas, pageTypes, setIn } from './lib/schema.js'
import { registryFor, sitePageKeys } from './templates/sections.js'
import Fields from './components/Fields.jsx'
import SectionList from './components/SectionList.jsx'
import DesignPanel from './components/DesignPanel.jsx'
import PublishPanel from './components/PublishPanel.jsx'
import Preview from './components/Preview.jsx'
import { exportZip } from './lib/export.js'

const STORAGE_KEY = 'buildrr:v1'
const LEGACY_STORAGE_KEY = 'pagesmith:v1' // pre-rename saves

// Merge a saved page-type tree over defaults, and migrate the pre-Publish-tab
// `formAction` field into the new `capture` model.
function mergeTree(type, saved, formActionPath) {
  const tree = { ...structuredClone(defaults[type]), ...saved }
  if (saved && !saved.capture && formActionPath) {
    const legacy = formActionPath.split('.').reduce((o, k) => (o == null ? o : o[k]), saved)
    if (legacy) tree.capture = { ...tree.capture, destination: 'custom', actionUrl: legacy }
  }
  return tree
}

function initialConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY))
    if (saved?.brand && saved?.pageType) {
      // Merge over defaults so new fields added later don't break old saves.
      return {
        pageType: saved.pageType,
        skin: saved.skin || 'editorial',
        brand: { ...defaults.brand, ...saved.brand },
        optin: mergeTree('optin', saved.optin, 'settings.formAction'),
        sales: mergeTree('sales', saved.sales),
        site: mergeTree('site', saved.site, 'contact.formAction'),
      }
    }
  } catch {
    /* fall through to defaults */
  }
  return {
    pageType: 'optin',
    skin: 'editorial',
    brand: structuredClone(defaults.brand),
    optin: structuredClone(defaults.optin),
    sales: structuredClone(defaults.sales),
    site: structuredClone(defaults.site),
  }
}

export default function App({ onHome = () => {} }) {
  const [config, setConfig] = React.useState(initialConfig)
  const [tab, setTab] = React.useState('content')
  const [device, setDevice] = React.useState('desktop')
  const [activePage, setActivePage] = React.useState('index.html')
  const [toastMsg, setToastMsg] = React.useState(null)
  const toastTimer = React.useRef(null)

  // Skip the mount-time save: a page that loads but is never touched (e.g. a
  // second open tab) must not clobber what another tab saved.
  const dirty = React.useRef(false)
  React.useEffect(() => {
    if (!dirty.current) {
      dirty.current = true
      return
    }
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      } catch {
        // Quota exceeded — usually several large uploaded images. The session
        // keeps working; it just can't autosave until an image is removed.
        console.warn('Buildrr: autosave skipped — storage quota exceeded (large uploaded images?)')
      }
    }, 500)
    return () => clearTimeout(t)
  }, [config])

  const toast = React.useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200)
  }, [])

  const updateContent = (path, value) => setConfig((c) => setIn(c, `${c.pageType}.${path}`, value))
  const setBrand = (patch) => setConfig((c) => ({ ...c, brand: { ...c.brand, ...patch } }))

  // Inline edits arriving from the preview iframe. Paths are relative to the
  // page-type tree, except brand.* (the nav/footer brand name).
  const onPreviewEdit = React.useCallback((path, value) => {
    if (path.startsWith('brand.')) {
      setConfig((c) => ({ ...c, brand: { ...c.brand, [path.slice(6)]: value } }))
    } else {
      setConfig((c) => setIn(c, `${c.pageType}.${path}`, value))
    }
  }, [])

  // Clicking a section in the preview opens its editor group in the sidebar.
  const [sectionFocus, setSectionFocus] = React.useState(null)
  const onSectionFocus = React.useCallback((key) => {
    setTab('content')
    setSectionFocus({ key, n: Date.now() })
  }, [])

  // Clicking an unconfigured buy button in the preview: open the Publish tab
  // and highlight the checkout-link field so it's obvious where the URL goes.
  const [checkoutHighlight, setCheckoutHighlight] = React.useState(null)
  const onSetupCheckout = React.useCallback(() => {
    setTab('publish')
    setCheckoutHighlight({ n: Date.now() })
  }, [])
  const setSkin = (skin) => setConfig((c) => ({ ...c, skin }))
  const setPageType = (pageType) => {
    setActivePage('index.html')
    setConfig((c) => ({ ...c, pageType }))
  }

  // Section layout for whichever page is being edited.
  const isSite = config.pageType === 'site'
  const sitePage = sitePageKeys[activePage] // undefined on the thank-you tab
  const layout = isSite ? (sitePage ? config.site._layout[sitePage] : null) : config[config.pageType]._layout
  const registry = registryFor(config.pageType, sitePage)
  const setLayout = (next) =>
    setConfig((c) => setIn(c, isSite ? `site._layout.${sitePage}` : `${c.pageType}._layout`, next))

  // Email capture lives on the page-type tree (opt-in form / contact form).
  const capture = config[config.pageType].capture
  const setCapture = (patch) =>
    setConfig((c) => setIn(c, `${c.pageType}.capture`, { ...c[c.pageType].capture, ...patch }))

  // Netlify site association (per page type), saved after the first publish.
  const publish = config[config.pageType].publish
  const setPublish = (patch) =>
    setConfig((c) => setIn(c, `${c.pageType}.publish`, { ...c[c.pageType].publish, ...patch }))
  // Disconnecting is account-level: forget the saved site on every page type.
  const clearAllPublish = () =>
    setConfig((c) => {
      const blank = { netlifySiteId: '', netlifyUrl: '' }
      return { ...c, optin: { ...c.optin, publish: blank }, sales: { ...c.sales, publish: blank }, site: { ...c.site, publish: blank } }
    })

  const onExport = async () => {
    const name = await exportZip(config)
    toast(`Exported ${name}.zip — unzip and upload anywhere`)
  }

  const onReset = () => {
    if (!window.confirm('Reset the current page type back to its starter copy? Your brand settings are kept.')) return
    setConfig((c) => ({ ...c, [c.pageType]: structuredClone(defaults[c.pageType]) }))
  }

  return (
    <div className="app">
      <div className="topbar">
        <button className="logo logo-link" onClick={onHome} title="Back to the Buildrr home page">
          <span className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff">
              <rect x="3" y="13" width="18" height="7" rx="2" />
              <rect x="6" y="4" width="12" height="7" rx="2" opacity="0.8" />
            </svg>
          </span>
          Buildrr
        </button>
        <div className="seg" role="tablist" aria-label="Page type">
          {Object.entries(pageTypes).map(([id, p]) => (
            <button key={id} className={config.pageType === id ? 'on' : ''} onClick={() => setPageType(id)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="topbar-spacer" />
        <div className="seg mini" role="tablist" aria-label="Preview device">
          <button className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>
            Desktop
          </button>
          <button className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}>
            Mobile
          </button>
        </div>
        <button className="btn-quiet" onClick={onReset}>
          Reset copy
        </button>
        <button className="btn-primary" onClick={() => setTab('publish')}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z" />
          </svg>
          Publish
        </button>
      </div>

      <div className="body">
        <aside className="sidebar">
          <div className="side-tabs">
            <button className={tab === 'content' ? 'on' : ''} onClick={() => setTab('content')}>
              Content
            </button>
            <button className={tab === 'design' ? 'on' : ''} onClick={() => setTab('design')}>
              Design
            </button>
            <button className={tab === 'publish' ? 'on' : ''} onClick={() => setTab('publish')}>
              Publish
            </button>
          </div>
          <div className="side-scroll">
            {tab === 'publish' ? (
              <PublishPanel
                pageType={config.pageType}
                capture={capture}
                setCapture={setCapture}
                content={config[config.pageType]}
                update={updateContent}
                config={config}
                publish={publish}
                setPublish={setPublish}
                clearAllPublish={clearAllPublish}
                onExport={onExport}
                toast={toast}
                checkoutHighlight={checkoutHighlight}
              />
            ) : tab === 'content' ? (
              <>
                {isSite && (
                  <div className="editing-note">
                    {sitePage
                      ? `Editing the ${sitePage === 'home' ? 'Home' : sitePage[0].toUpperCase() + sitePage.slice(1)} page — switch pages with the tabs above the preview.`
                      : 'The thank-you page has no editable sections. Pick a page with the tabs above the preview.'}
                  </div>
                )}
                <Fields schema={pinnedSchemas[config.pageType].top} content={config[config.pageType]} update={updateContent} />
                {layout && (
                  <SectionList
                    registry={registry}
                    layout={layout}
                    setLayout={setLayout}
                    content={config[config.pageType]}
                    update={updateContent}
                    focusSection={sectionFocus}
                  />
                )}
                <Fields schema={pinnedSchemas[config.pageType].bottom} content={config[config.pageType]} update={updateContent} />
              </>
            ) : (
              <DesignPanel config={config} setSkin={setSkin} setBrand={setBrand} />
            )}
          </div>
        </aside>

        <Preview
          config={config}
          device={device}
          activePage={activePage}
          setActivePage={setActivePage}
          toast={toast}
          onEdit={onPreviewEdit}
          onSectionFocus={onSectionFocus}
          onSetupCheckout={onSetupCheckout}
        />
      </div>

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  )
}

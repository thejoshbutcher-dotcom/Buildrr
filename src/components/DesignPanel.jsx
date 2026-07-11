import React from 'react'
import { skins, headlineFonts } from '../templates/skins.js'
import { palettes } from '../lib/palettes.js'
import { ImageField } from './Fields.jsx'

const skinPreviews = {
  editorial: { glyph: 'Aa', style: { background: '#2b2620', fontFamily: 'Georgia, serif', fontStyle: 'italic' } },
  impact: { glyph: 'AA', style: { background: '#111', fontFamily: 'Arial Black, sans-serif', letterSpacing: '-1px' } },
  lumen: { glyph: 'Aa', style: { background: 'linear-gradient(135deg, #4f6df5, #9d5cf0)', fontFamily: 'Verdana, sans-serif' } },
}

const HEX = /^#[0-9a-fA-F]{6}$/

function ColorField({ label, value, onChange }) {
  const [text, setText] = React.useState(value)
  React.useEffect(() => setText(value), [value])
  return (
    <div className="color-field">
      <label style={{ display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 5 }}>{label}</label>
      <div className="chip">
        <input type="color" value={HEX.test(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value)} aria-label={`${label} color picker`} />
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (HEX.test(e.target.value.trim())) onChange(e.target.value.trim())
          }}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  )
}

export default function DesignPanel({ config, setSkin, setBrand }) {
  const { brand, skin } = config
  const activePalette = palettes.find((p) => p.primary === brand.primary && p.accent === brand.accent)

  return (
    <div>
      <div className="design-label">Template style</div>
      <div className="skin-cards">
        {Object.entries(skins).map(([id, s]) => (
          <button key={id} className={`skin-card ${skin === id ? 'on' : ''}`} onClick={() => setSkin(id)}>
            <span className="skin-thumb" style={skinPreviews[id].style}>
              {skinPreviews[id].glyph}
            </span>
            <span>
              <b>{s.name}</b>
              <span>{s.blurb}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="design-label">Brand</div>
      <div className="f">
        <label htmlFor="brand-name">Brand / business name</label>
        <input id="brand-name" type="text" value={brand.name} onChange={(e) => setBrand({ name: e.target.value })} />
      </div>
      <ImageField label="Logo (shown in the header instead of the name)" value={brand.logo || ''} onChange={(v) => setBrand({ logo: v })} />
      {brand.logo && <div className="help" style={{ marginTop: -4, marginBottom: 12 }}>The name is still used for the browser tab, footer, and image alt text.</div>}

      <div className="design-label">Colors</div>
      <div className="palettes" style={{ marginBottom: 12 }}>
        {palettes.map((p) => (
          <button
            key={p.name}
            className={`palette ${activePalette?.name === p.name ? 'on' : ''}`}
            onClick={() => setBrand({ primary: p.primary, accent: p.accent })}
            title={p.name}
          >
            <span className="swatches">
              <i style={{ background: p.primary }} />
              <i style={{ background: p.accent }} />
            </span>
            <small>{p.name}</small>
          </button>
        ))}
      </div>
      <div className="color-row">
        <ColorField label="Primary" value={brand.primary} onChange={(v) => setBrand({ primary: v })} />
        <ColorField label="Accent" value={brand.accent} onChange={(v) => setBrand({ accent: v })} />
      </div>

      <div className="design-label">Background tone</div>
      <div className="seg" style={{ display: 'flex' }}>
        {[
          ['light', 'Light'],
          ['tinted', 'Tinted'],
          ['dark', 'Dark'],
        ].map(([id, label]) => (
          <button key={id} className={brand.tone === id ? 'on' : ''} style={{ flex: 1 }} onClick={() => setBrand({ tone: id })}>
            {label}
          </button>
        ))}
      </div>

      <div className="design-label">Headline font</div>
      <div className="f">
        <select value={brand.font} onChange={(e) => setBrand({ font: e.target.value })} aria-label="Headline font">
          {Object.entries(headlineFonts).map(([id, f]) => (
            <option key={id} value={id}>
              {f.label}
            </option>
          ))}
        </select>
        <div className="help">Each template style ships with a matched pairing — override only the headlines if you want a different voice.</div>
      </div>
    </div>
  )
}

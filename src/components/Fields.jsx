import React from 'react'
import { get } from '../lib/schema.js'

// Downscale an uploaded image to a reasonable data URI so localStorage and
// the exported ZIP stay small. PNGs keep transparency; photos become JPEG.
function downscale(file, maxW = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(img.src)
      const isPng = file.type === 'image/png'
      resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export function ImageField({ label, value, onChange }) {
  const fileRef = React.useRef(null)
  const isUpload = (value || '').startsWith('data:')
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      onChange(await downscale(file))
    } catch {
      /* unreadable file — leave value unchanged */
    }
    e.target.value = ''
  }
  return (
    <div className="f">
      {label && <label>{label}</label>}
      <div className="img-field">
        {value ? <img src={value} alt="" className="img-thumb" /> : <span className="img-thumb empty">None</span>}
        <div className="img-actions">
          <button type="button" className="img-btn" onClick={() => fileRef.current.click()}>
            Upload
          </button>
          {value && (
            <button type="button" className="img-btn danger" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder={isUpload ? 'Uploaded image — paste a URL to replace' : '…or paste an image URL'}
        value={isUpload ? '' : value || ''}
        onChange={(e) => onChange(e.target.value.trim())}
        aria-label={`${label || 'Image'} URL`}
      />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  )
}

function SelectInput({ id, value, options, onChange }) {
  return (
    <select id={id} value={value || ''} onChange={(e) => onChange(e.target.value)}>
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  )
}

export function Field({ field, content, update }) {
  const value = get(content, field.path)

  // Fields can hide themselves until they're relevant (e.g. a size slider
  // that only matters once an image is set).
  if (field.showIf && !field.showIf(content)) return null

  if (field.type === 'range') {
    const val = Number(value ?? field.def ?? 50)
    return (
      <div className="f">
        <label htmlFor={field.path}>
          {field.label} — {val}%
        </label>
        <input
          id={field.path}
          type="range"
          min={field.min ?? 0}
          max={field.max ?? 100}
          value={val}
          onChange={(e) => update(field.path, Number(e.target.value))}
        />
        {field.help && <div className="help">{field.help}</div>}
      </div>
    )
  }

  if (field.type === 'toggle') {
    return (
      <div className="toggle-row">
        <label htmlFor={field.path}>{field.label}</label>
        <span className="switch">
          <input id={field.path} type="checkbox" checked={!!value} onChange={(e) => update(field.path, e.target.checked)} />
          <span className="track" />
        </span>
      </div>
    )
  }

  if (field.type === 'image') {
    return <ImageField label={field.label} value={value || ''} onChange={(v) => update(field.path, v)} />
  }

  if (field.type === 'select') {
    return (
      <div className="f">
        <label htmlFor={field.path}>{field.label}</label>
        <SelectInput id={field.path} value={value} options={field.options} onChange={(v) => update(field.path, v)} />
      </div>
    )
  }

  if (field.type === 'items') {
    const items = value || []
    const blank = () => Object.fromEntries(field.fields.map((f) => [f.path, '']))
    return (
      <div className="f">
        <label>{field.label}</label>
        {items.map((item, i) => (
          <div className="item-card" key={i}>
            <button className="item-remove" title="Remove" onClick={() => update(field.path, items.filter((_, j) => j !== i))}>
              ✕
            </button>
            {field.fields.map((sub) => {
              const setSub = (v) => update(field.path, items.map((it, j) => (j === i ? { ...it, [sub.path]: v } : it)))
              return (
                <div className="f" key={sub.path}>
                  <label>{sub.label}</label>
                  {sub.type === 'textarea' ? (
                    <textarea rows={2} value={item[sub.path] || ''} onChange={(e) => setSub(e.target.value)} />
                  ) : sub.type === 'select' ? (
                    <SelectInput value={item[sub.path]} options={sub.options} onChange={setSub} />
                  ) : (
                    <input type="text" value={item[sub.path] || ''} onChange={(e) => setSub(e.target.value)} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
        {items.length < (field.max || 8) && (
          <button className="item-add" onClick={() => update(field.path, [...items, blank()])}>
            + Add {field.label.replace(/s$/, '').toLowerCase()}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="f">
      <label htmlFor={field.path}>{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea id={field.path} rows={3} value={value || ''} onChange={(e) => update(field.path, e.target.value)} />
      ) : (
        <input
          id={field.path}
          type={field.type === 'url' ? 'url' : 'text'}
          placeholder={field.type === 'url' ? 'https://…' : ''}
          value={value || ''}
          onChange={(e) => update(field.path, e.target.value)}
        />
      )}
      {field.help && <div className="help">{field.help}</div>}
    </div>
  )
}

export default function Fields({ schema, content, update }) {
  return (
    <>
      {schema.map((group, gi) => (
        <details className="group" key={group.group} open={gi === 0}>
          <summary>{group.group}</summary>
          <div className="group-body">
            {group.fields.map((field) => (
              <Field key={field.path} field={field} content={content} update={update} />
            ))}
          </div>
        </details>
      ))}
    </>
  )
}

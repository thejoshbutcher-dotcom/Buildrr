import React from 'react'
import { Field, ImageField } from './Fields.jsx'

// Every section can carry a background image; opacity keeps text readable.
function BgPanel({ entry, onPatch }) {
  const bg = entry.bg
  const pct = Math.round((bg?.opacity ?? 0.25) * 100)
  return (
    <div className="bg-panel">
      <ImageField
        label="Background image"
        value={bg?.image || ''}
        onChange={(image) => onPatch({ bg: image ? { image, opacity: bg?.opacity ?? 0.25 } : undefined })}
      />
      {bg?.image && (
        <>
          <div className="f">
            <label htmlFor={`bg-op-${entry.key}`}>Image opacity — {pct}% {pct > 60 ? '(check text readability)' : ''}</label>
            <input
              id={`bg-op-${entry.key}`}
              type="range"
              min="5"
              max="100"
              value={pct}
              onChange={(e) => onPatch({ bg: { ...bg, opacity: e.target.value / 100 } })}
            />
          </div>
          <div className="toggle-row">
            <label htmlFor={`bg-inv-${entry.key}`}>Invert text color for readability</label>
            <span className="switch">
              <input
                id={`bg-inv-${entry.key}`}
                type="checkbox"
                checked={!!bg.invert}
                onChange={(e) => onPatch({ bg: { ...bg, invert: e.target.checked } })}
              />
              <span className="track" />
            </span>
          </div>
        </>
      )}
    </div>
  )
}

const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.6" />
    {off && <path d="M4 20L20 4" />}
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
)

function SectionGroup({ entry, def, content, update, controls, dragProps, dragging, onPatch }) {
  return (
    <details
      className={`group section-group ${entry.hidden ? 'off' : ''} ${dragging ? 'dragging' : ''}`}
      data-key={entry.key}
      {...(dragProps?.wrapper || {})}
    >
      <summary>
        <span className="sg-left">
          {dragProps ? (
            <span className="drag-handle" title="Drag to reorder" {...dragProps.handle}>
              ⠿
            </span>
          ) : (
            <span className="drag-handle locked" title="This section is fixed">
              <LockIcon />
            </span>
          )}
          <span className="sg-label">{def.label}</span>
        </span>
        <span className="sg-controls">{controls}</span>
      </summary>
      <div className="group-body">
        {entry.hidden && <div className="hidden-note">Hidden — this section won’t appear on the page.</div>}
        {def.fields.length === 0 && !entry.hidden && <div className="hidden-note">This section reuses copy from other sections — nothing extra to edit.</div>}
        {def.fields.map((field) => (
          <Field key={field.path || field.label} field={field} content={content} update={update} />
        ))}
        <BgPanel entry={entry} onPatch={onPatch} />
      </div>
    </details>
  )
}

export default function SectionList({ registry, layout, setLayout, content, update, focusSection }) {
  const [addOpen, setAddOpen] = React.useState(false)
  const listRef = React.useRef(null)

  // A section was clicked in the preview: open its group, scroll it into
  // view, and flash it so the eye lands in the right place.
  React.useEffect(() => {
    if (!focusSection) return
    const el = listRef.current?.querySelector(`details[data-key="${focusSection.key}"]`)
    if (!el) return
    el.open = true
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    el.classList.add('flash')
    const t = setTimeout(() => el.classList.remove('flash'), 1200)
    return () => clearTimeout(t)
  }, [focusSection])
  // The index lives in a ref so dragenter handlers see it synchronously;
  // the state copy only drives the highlight styling.
  const dragRef = React.useRef(null)
  const [dragIdx, setDragIdxState] = React.useState(null)
  const setDragIdx = (i) => {
    dragRef.current = i
    setDragIdxState(i)
  }

  const known = layout.filter((s) => registry[s.key])
  const lockedEntries = known.filter((s) => registry[s.key].locked)
  const rest = known.filter((s) => !registry[s.key].locked)
  const available = Object.entries(registry).filter(([key]) => !known.some((s) => s.key === key))

  const commit = (nextRest) => setLayout([...lockedEntries, ...nextRest])

  const patch = (key, changes) => commit(rest.map((s) => (s.key === key ? { ...s, ...changes } : s)))
  // Patch any entry in place (locked ones included) without reordering.
  const patchAny = (key, changes) => setLayout(layout.map((s) => (s.key === key ? { ...s, ...changes } : s)))
  const remove = (key) => commit(rest.filter((s) => s.key !== key))
  const add = (key) => {
    commit([...rest, { key }])
    setAddOpen(false)
  }

  const moveTo = (from, to) => {
    const next = [...rest]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    commit(next)
    setDragIdx(to)
  }

  const controlsFor = (entry) => (
    <>
      <button
        className="sg-btn"
        title={entry.hidden ? 'Show section' : 'Hide section'}
        aria-label={entry.hidden ? `Show ${registry[entry.key].label}` : `Hide ${registry[entry.key].label}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          patch(entry.key, { hidden: !entry.hidden })
        }}
      >
        <EyeIcon off={entry.hidden} />
      </button>
      <button
        className="sg-btn danger"
        title="Remove section (its text is kept and restored if you re-add it)"
        aria-label={`Remove ${registry[entry.key].label}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          remove(entry.key)
        }}
      >
        ✕
      </button>
    </>
  )

  return (
    <div ref={listRef}>
      {lockedEntries.map((entry) => (
        <SectionGroup
          key={entry.key}
          entry={entry}
          def={registry[entry.key]}
          content={content}
          update={update}
          controls={null}
          dragProps={null}
          onPatch={(changes) => patchAny(entry.key, changes)}
        />
      ))}

      {rest.map((entry, i) => (
        <SectionGroup
          key={entry.key}
          entry={entry}
          def={registry[entry.key]}
          content={content}
          update={update}
          controls={controlsFor(entry)}
          dragging={dragIdx === i}
          onPatch={(changes) => patchAny(entry.key, changes)}
          dragProps={{
            handle: {
              draggable: true,
              onDragStart: (e) => {
                e.dataTransfer.effectAllowed = 'move'
                // Use the whole group as the drag image so it reads as moving a card.
                const card = e.currentTarget.closest('.section-group')
                if (card) e.dataTransfer.setDragImage(card, 20, 20)
                setDragIdx(i)
              },
              onDragEnd: () => setDragIdx(null),
            },
            wrapper: {
              onDragOver: (e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
              },
              onDragEnter: () => {
                if (dragRef.current !== null && dragRef.current !== i) moveTo(dragRef.current, i)
              },
              onDrop: (e) => {
                e.preventDefault()
                setDragIdx(null)
              },
            },
          }}
        />
      ))}

      {available.length > 0 && (
        <div className="add-wrap">
          <button className="item-add" onClick={() => setAddOpen((o) => !o)}>
            {addOpen ? '− Close' : '+ Add section'}
          </button>
          {addOpen && (
            <div className="add-panel">
              {available.map(([key, def]) => (
                <button key={key} className="add-option" onClick={() => add(key)}>
                  <b>{def.label}</b>
                  <span>{def.blurb}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import JSZip from 'jszip'
import { buildFiles } from '../templates/build.js'

const extOf = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }

// Turn the raw buildFiles output into the final deployable file set: uploaded
// images (data URIs) become real files under img/ and the HTML/CSS is rewritten
// to point at them. Shared by ZIP download, single-file export, and Netlify
// publish so all three ship byte-identical output.
export function assembleSite(config) {
  const { files, pages, zipName } = buildFiles(config, { preview: false })
  const images = new Map()
  for (const [path, content] of Object.entries(files)) {
    if (!/\.(html|css)$/.test(path)) continue
    files[path] = content.replace(/data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)/g, (match, mime) => {
      if (!images.has(match)) {
        const b64 = match.slice(match.indexOf(',') + 1)
        images.set(match, { name: `img/img-${images.size + 1}.${extOf[mime]}`, b64 })
      }
      return images.get(match).name
    })
  }
  // Normalize into { path: { data, encoding } }.
  const out = {}
  for (const [path, content] of Object.entries(files)) out[path] = { data: content, encoding: 'utf8' }
  for (const { name, b64 } of images.values()) out[name] = { data: b64, encoding: 'base64' }
  return { files: out, pages, zipName }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function exportZip(config) {
  const { files, zipName } = assembleSite(config)
  const zip = new JSZip()
  for (const [path, { data, encoding }] of Object.entries(files)) {
    zip.file(path, data, encoding === 'base64' ? { base64: true } : undefined)
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  triggerDownload(blob, `${zipName}.zip`)
  return zipName
}

// Single self-contained .html: CSS inlined into <style>, JS into <script>, and
// every img/ reference turned back into a data URI. Nothing external except the
// Google Fonts <link>. Made for pasting into a single custom-HTML block (GHL,
// ClickFunnels, Webflow embed, etc.).
export function buildSingleHtml(config) {
  const { files, zipName } = assembleSite(config)
  const css = files['css/styles.css']?.data || ''
  const js = files['js/main.js']?.data || ''
  const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }

  let html = files['index.html'].data
  html = html
    .replace('<link rel="stylesheet" href="css/styles.css">', `<style>\n${css}\n</style>`)
    .replace('<script src="js/main.js"></script>', `<script>\n${js}\n</script>`)

  // Inline any extracted images back as data URIs.
  html = html.replace(/(src|href)="(img\/img-\d+\.(png|jpe?g|webp|gif))"/g, (m, attr, path, ext) => {
    const img = files[path]
    return img ? `${attr}="data:${mime[ext]};base64,${img.data}"` : m
  })
  return { html, name: `${zipName}.html` }
}

export function exportSingleHtml(config) {
  const { html, name } = buildSingleHtml(config)
  triggerDownload(new Blob([html], { type: 'text/html' }), name)
  return name
}

export async function copySingleHtml(config) {
  const { html } = buildSingleHtml(config)
  await navigator.clipboard.writeText(html)
  return html.length
}

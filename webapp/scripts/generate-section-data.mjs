import fs from 'node:fs'
import path from 'node:path'

const repoRoot = path.resolve(process.cwd(), '..')
const outDir = path.resolve(process.cwd(), 'public', 'data', 'sections')
const legacyOutPath = path.resolve(process.cwd(), 'src', 'data', 'sectionContent.generated.json')

const sectionFiles = [
  { slug: 'strategy', file: '01-strategy.html' },
  { slug: 'architecture', file: '02-architecture.html' },
  { slug: 'infrastructure', file: '03-infrastructure.html' },
  { slug: 'minios', file: '04-minios.html' },
  { slug: 'value-engines', file: '05-value-engines.html' },
  { slug: 'delivery', file: '06-delivery.html' },
  { slug: 'qms', file: '07-qms.html' },
  { slug: 'execution', file: '08-execution.html' },
  { slug: 'audit-standards', file: '09-audit-standards.html' },
  { slug: 'project-management', file: '10-project-management.html' },
  { slug: 'client-projects', file: '11-client-projects.html' },
  { slug: 'reporting-dashboard', file: '12-reporting-dashboard.html' },
  { slug: 'agentic-factory-library', file: '13-agentic-factory-library.html' },
  { slug: 'build-guides', file: '14-build-guides.html' },
  { slug: 'change-log', file: '15-change-log.html' },
]

function normalizeText(raw) {
  return (raw || '')
    .replace(/\u00A0/g, ' ')
    .replace(/\u00C2/g, '')
    .replace(/[\u0080-\u009F]/g, '')
    .replace(/\uFFFD/g, '')
    .replace(/[^\x00-\x7F]/g, (ch) => {
      const map = {
        '·': ' - ',
        '—': '-',
        '–': '-',
        '’': "'",
        '‘': "'",
        '“': '"',
        '”': '"',
        '…': '...',
        '→': '->',
      }
      return map[ch] ?? ''
    })
    .replace(/Ã‚/g, '')
    .replace(/Ã¢â‚¬â€/g, '-')
    .replace(/Ã¢â‚¬â€œ/g, '-')
    .replace(/Ã¢â€˜/g, "'")
    .replace(/Ã¢â€™/g, "'")
    .replace(/Ã¢â€œ/g, '"')
    .replace(/Ã¢â€/g, '"')
    .replace(/Ã¢â€¦/g, '...')
    .replace(/Ã¢â€ â€™/g, '->')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, ' - ')
    .replace(/·/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripTags(raw) {
  return normalizeText((raw || '').replace(/<[^>]+>/g, ''))
}

function normalizeTabLabel(raw, fallbackIndex) {
  const cleaned = stripTags(raw)
  const match = cleaned.match(/^(\d{1,2})\s*[^A-Za-z0-9]*\s*(.+)$/)
  if (!match) {
    const num = String(fallbackIndex + 1).padStart(2, '0')
    const title = (cleaned || 'Content').replace(/^tab\s*\d+\s*[-:.]*\s*/i, '').trim() || 'Content'
    return `${num} - ${title}`
  }
  const num = match[1].padStart(2, '0')
  const title = match[2].trim()
  return `${num} - ${title}`
}

function sanitizeHtml(raw) {
  return normalizeText(
    (raw || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
      .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
      .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/\bvault-frame-wrap\b/g, 'vault-frame-block')
      .replace(/\bvault-frame\b/g, 'vault-view')
      .replace(/\bbp-shell\b/g, 'bp-grid'),
  )
}

function stripOuterLayers(raw) {
  let out = (raw || '').trim()

  // Remove only trailing tab-divider comments, not in-panel section comments.
  out = out.replace(/\s*<!--\s*--\s*TAB[\s\S]*?-->\s*$/i, '')

  // Peel common panel wrappers, but do not recursively trim generic closers.
  // Recursive closer trimming can truncate valid content-heavy panels.
  out = out.replace(/^<div\s+class="panel(?:\s+active)?\"[^>]*>\s*<div\s+class="pw">\s*/i, '')
  out = out.replace(/^<section\s+class="panel(?:\s+active)?\"[^>]*>\s*<div\s+class="pw">\s*/i, '')
  out = out.replace(/^<(?:div|section)\s+class="panel(?:\s+active)?\"[^>]*>\s*/i, '')
  out = out.replace(/^<div\s+class="pw">\s*/i, '')
  out = out.replace(/\s*<\/div>\s*<\/div>\s*$/i, '')
  out = out.replace(/\s*<\/section>\s*$/i, '')
  out = out.replace(/^(?:<\/div>\s*)+/, '')
  out = out.trim()

  return out
}

function getMatches(regex, input) {
  const out = []
  let match
  while ((match = regex.exec(input)) !== null) {
    out.push(match)
  }
  return out
}

function extractTabs(html) {
  const tabRegex = /<(?:button|div)\s+class="[^"]*\b(?:tab|ntab)\b[^"]*"[^>]*>([\s\S]*?)<\/(?:button|div)>/gi
  const matches = getMatches(tabRegex, html)
  return matches.map((m, index) => ({
    id: `tab-${index + 1}`,
    label: normalizeTabLabel(m[1], index),
  }))
}

function extractPanels(html) {
  const panelStartRegex = /<(?:section|div)\s+class="panel(?:\s+active)?\"[^>]*>/gi
  const starts = getMatches(panelStartRegex, html).map((m) => ({ idx: m.index, tag: m[0] }))
  if (starts.length === 0) {
    return []
  }

  const scriptIdx = html.lastIndexOf('<script')
  const endCap = scriptIdx > 0 ? scriptIdx : html.length

  return starts.map((start, index) => {
    const next = starts[index + 1]
    const panelEnd = next ? next.idx : endCap
    const chunk = html.slice(start.idx, panelEnd).trim()
    const idMatch = start.tag.match(/id="([^"]+)"/i)
    const id = idMatch ? idMatch[1] : `panel-${index + 1}`
    return { id, html: chunk }
  })
}

function extractGroups(panelHtml) {
  const cleanPanel = stripOuterLayers(panelHtml)
  const secHeadRegex =
    /<div class="sec-head[^"]*">[\s\S]*?<span class="sec-label">([\s\S]*?)<\/span>[\s\S]*?<div class="sec-(?:head-line|line)"><\/div>\s*<\/div>/gi
  const heads = getMatches(secHeadRegex, cleanPanel).map((m) => ({
    label: stripTags(m[1]),
    idx: m.index,
    len: m[0].length,
  }))

  const groups = []
  if (heads.length === 0) {
    groups.push({
      label: 'Content',
      html: sanitizeHtml(cleanPanel),
    })
    return groups
  }

  const pre = cleanPanel.slice(0, heads[0].idx).trim()
  if (stripTags(pre)) {
    groups.push({
      label: 'Overview',
      html: sanitizeHtml(stripOuterLayers(pre)),
    })
  }

  heads.forEach((head, index) => {
    const next = heads[index + 1]
    const start = head.idx + head.len
    const end = next ? next.idx : cleanPanel.length
    const body = stripOuterLayers(cleanPanel.slice(start, end).trim())
    if (!stripTags(body)) {
      return
    }
    groups.push({
      label: head.label || `Group ${index + 1}`,
      html: sanitizeHtml(body),
    })
  })

  return groups
}

function extractSection(slug, file) {
  const fullPath = path.join(repoRoot, file)
  const html = fs.readFileSync(fullPath, 'utf8')
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? stripTags(titleMatch[1]) : file
  const tabs = extractTabs(html)
  const panels = extractPanels(html)

  const tabData = (tabs.length ? tabs : [{ id: 'tab-1', label: 'Content' }]).map((tab, index) => {
    const panel = panels[index] || panels[0] || { id: `panel-${index + 1}`, html }
    return {
      id: tab.id,
      label: normalizeTabLabel(tab.label, index),
      panelId: panel.id,
      groups: extractGroups(panel.html),
    }
  })

  return {
    slug,
    file,
    title,
    tabs: tabData,
  }
}

const generated = sectionFiles.map((item) => extractSection(item.slug, item.file))
fs.mkdirSync(outDir, { recursive: true })

for (const section of generated) {
  const filePath = path.join(outDir, `${section.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(section, null, 2))
}

if (fs.existsSync(legacyOutPath)) {
  fs.unlinkSync(legacyOutPath)
}

console.log(`Generated ${generated.length} sections -> ${outDir}`)

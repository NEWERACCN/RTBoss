import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const sectionsDir = path.join(rootDir, 'public', 'data', 'sections')

const entityMap = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
}

function decodeEntities(input) {
  if (!input) return ''
  let output = input
  for (const [entity, value] of Object.entries(entityMap)) {
    output = output.split(entity).join(value)
  }
  output = output.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  return output
}

function stripTags(input) {
  return decodeEntities(input)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeSpaces(input) {
  return input
    .replace(/\u00A0/g, ' ')
    .replace(/\u200B/g, '')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanHtml(html) {
  return html
    .replace(/\u00A0/g, ' ')
    .replace(/\u200B/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function normalizeTabLabel(label, fallbackIndex) {
  const clean = normalizeSpaces(label)
  const match = clean.match(/^(\d{1,2})\s*[.\-·]\s*(.+)$/)
  const number = match ? match[1].padStart(2, '0') : String(fallbackIndex + 1).padStart(2, '0')
  const text = normalizeSpaces(match ? match[2] : clean)
  return `${number} - ${text}`
}

function extractFieldValues(html, fieldName) {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `<strong>\\s*${escaped}\\s*:\\s*<\\/strong>\\s*([\\s\\S]*?)(?=<\\/p>|<strong>|<\\/li>|<\\/div>|$)`,
    'gi',
  )
  const values = []
  for (const match of html.matchAll(pattern)) {
    const text = normalizeSpaces(stripTags(match[1] ?? ''))
    if (text) values.push(text)
  }
  return values
}

function extractOrderedSteps(html) {
  const listMatches = [...html.matchAll(/<ol[^>]*>([\s\S]*?)<\/ol>/gi)]
  const steps = []
  for (const listMatch of listMatches) {
    const listHtml = listMatch[1] ?? ''
    for (const liMatch of listHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
      const text = normalizeSpaces(stripTags(liMatch[1] ?? ''))
      if (text) steps.push(text)
    }
  }
  return steps
}

function extractCallout(html) {
  const calloutMatch = html.match(/<div[^>]*class="[^"]*callout-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (!calloutMatch) return ''
  return normalizeSpaces(stripTags(calloutMatch[1] ?? ''))
}

function extractPurpose(html) {
  const headingMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ?? html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)
  if (headingMatch) return normalizeSpaces(stripTags(headingMatch[1] ?? ''))

  const paragraphMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  if (paragraphMatch) return normalizeSpaces(stripTags(paragraphMatch[1] ?? ''))

  return ''
}

function extractMetrics(html) {
  const candidates = []
  const text = stripTags(html)
  const percentMatches = text.match(/\b\d+(?:\.\d+)?%\b/g) ?? []
  if (percentMatches.length) {
    candidates.push(`Contains percentage targets: ${[...new Set(percentMatches)].join(', ')}`)
  }
  const hasMrr = /\bMRR\b/i.test(text)
  if (hasMrr) candidates.push('Contains MRR references')
  return candidates
}

function normalizeGroup(tabId, group, groupIndex) {
  const html = cleanHtml(group.html ?? '')
  const label = normalizeSpaces(group.label ?? `Group ${groupIndex + 1}`)
  const inputs = extractFieldValues(html, 'Input')
  const outputs = extractFieldValues(html, 'Output')
  const steps = extractOrderedSteps(html)
  const callout = extractCallout(html)

  return {
    ...group,
    id: group.id ?? `${tabId}-group-${String(groupIndex + 1).padStart(2, '0')}`,
    label,
    html,
    purpose: group.purpose ?? extractPurpose(html),
    inputs: Array.isArray(group.inputs) ? group.inputs : inputs,
    outputs: Array.isArray(group.outputs) ? group.outputs : outputs,
    steps: Array.isArray(group.steps) ? group.steps : steps,
    metrics: Array.isArray(group.metrics) ? group.metrics : extractMetrics(html),
    callout: typeof group.callout === 'string' ? group.callout : callout,
  }
}

function normalizeSection(section) {
  const tabs = (section.tabs ?? []).map((tab, tabIndex) => {
    const id = tab.id ?? `tab-${tabIndex + 1}`
    return {
      ...tab,
      id,
      label: normalizeTabLabel(tab.label ?? `Tab ${tabIndex + 1}`, tabIndex),
      groups: (tab.groups ?? []).map((group, groupIndex) => normalizeGroup(id, group, groupIndex)),
    }
  })

  return {
    ...section,
    tabs,
  }
}

function main() {
  const files = fs
    .readdirSync(sectionsDir)
    .filter((name) => name.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b))

  for (const fileName of files) {
    const filePath = path.join(sectionsDir, fileName)
    const raw = fs.readFileSync(filePath, 'utf8')
    const section = JSON.parse(raw)
    const normalized = normalizeSection(section)
    fs.writeFileSync(filePath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8')
  }

  console.log(`Normalized ${files.length} section files in ${sectionsDir}`)
}

main()

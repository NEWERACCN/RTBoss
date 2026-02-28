export type SubjectMeta = {
  slug: string
  code: string
  title: string
  purpose: string
  workstream: string
  category: string
  complete: boolean
}

export const subjects: SubjectMeta[] = [
  { slug: 'strategy', code: '01', title: 'Strategic Framework', purpose: 'Section 01 source content.', workstream: 'Transformation', category: 'Planning', complete: false },
  { slug: 'architecture', code: '02', title: 'OS Framework', purpose: 'Section 02 source content.', workstream: 'Platform', category: 'Architecture', complete: false },
  { slug: 'infrastructure', code: '03', title: 'Technical Infrastructure', purpose: 'Section 03 source content.', workstream: 'Platform', category: 'Infrastructure', complete: false },
  { slug: 'minios', code: '04', title: 'Mini Operating System (Mini-OS)', purpose: 'Section 04 source content.', workstream: 'Operations', category: 'Operating Model', complete: false },
  { slug: 'value-engines', code: '05', title: 'Value Engines', purpose: 'Section 05 source content.', workstream: 'Commercial', category: 'Value Design', complete: false },
  { slug: 'delivery', code: '06', title: 'Agentic Factory', purpose: 'Section 06 source content.', workstream: 'Delivery', category: 'Execution', complete: false },
  { slug: 'qms', code: '07', title: 'Quality Management System', purpose: 'Section 07 source content.', workstream: 'Delivery', category: 'Quality', complete: false },
  { slug: 'execution', code: '08', title: 'Execution Standards', purpose: 'Section 08 source content.', workstream: 'Delivery', category: 'Standards', complete: false },
  { slug: 'audit-standards', code: '09', title: 'Audit Standards', purpose: 'Section 09 source content.', workstream: 'Governance', category: 'Audit', complete: false },
  { slug: 'project-management', code: '10', title: 'Enterprise Build Plan', purpose: 'Section 10 source content.', workstream: 'PMO', category: 'Planning', complete: false },
  { slug: 'client-projects', code: '11', title: 'Client Projects', purpose: 'Section 11 source content.', workstream: 'Client Delivery', category: 'Portfolio', complete: false },
  { slug: 'reporting-dashboard', code: '12', title: 'Reporting Dashboard', purpose: 'Section 12 source content.', workstream: 'Analytics', category: 'Reporting', complete: false },
  { slug: 'agentic-factory-library', code: '13', title: 'Agentic Factory Library', purpose: 'Section 13 source content.', workstream: 'Platform', category: 'Library', complete: false },
  { slug: 'build-guides', code: '14', title: 'Build Guides', purpose: 'Section 14 source content.', workstream: 'Enablement', category: 'Guides', complete: false },
  { slug: 'change-log', code: '15', title: 'Change Log', purpose: 'Section 15 source content.', workstream: 'Governance', category: 'Change Control', complete: false },
]

export function getSubjectBySlug(slug: string) {
  return subjects.find((subject) => subject.slug === slug)
}

import type { ContextProfile } from './contextStore'

export type ContextPresetId =
  | 'executive-review'
  | 'ops-daily'
  | 'builder-mode'
  | 'audit-readiness'
  | 'custom'
  | 'section-default'

export const CONTEXT_PRESETS: Record<Exclude<ContextPresetId, 'custom' | 'section-default'>, ContextProfile> = {
  'executive-review': { role: 'executive', mode: 'overview', maturity: 'scaling' },
  'ops-daily': { role: 'operator', mode: 'operate', maturity: 'scaling' },
  'builder-mode': { role: 'builder', mode: 'build', maturity: 'foundation' },
  'audit-readiness': { role: 'operator', mode: 'overview', maturity: 'optimized' },
}

export const SECTION_DEFAULT_PROFILES: Record<string, ContextProfile> = {
  strategy: { role: 'executive', mode: 'overview', maturity: 'scaling' },
  architecture: { role: 'builder', mode: 'build', maturity: 'foundation' },
  infrastructure: { role: 'builder', mode: 'build', maturity: 'foundation' },
  minios: { role: 'builder', mode: 'build', maturity: 'scaling' },
  'value-engines': { role: 'operator', mode: 'operate', maturity: 'scaling' },
  delivery: { role: 'operator', mode: 'operate', maturity: 'scaling' },
  qms: { role: 'operator', mode: 'overview', maturity: 'optimized' },
  execution: { role: 'operator', mode: 'operate', maturity: 'scaling' },
  'audit-standards': { role: 'operator', mode: 'overview', maturity: 'optimized' },
  'project-management': { role: 'operator', mode: 'operate', maturity: 'scaling' },
  'client-projects': { role: 'executive', mode: 'overview', maturity: 'scaling' },
  'reporting-dashboard': { role: 'executive', mode: 'overview', maturity: 'optimized' },
  'agentic-factory-library': { role: 'builder', mode: 'build', maturity: 'optimized' },
  'build-guides': { role: 'builder', mode: 'build', maturity: 'scaling' },
  'change-log': { role: 'executive', mode: 'overview', maturity: 'optimized' },
}


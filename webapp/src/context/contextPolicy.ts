import type { ContextMaturity, ContextMode, ContextRole } from './contextStore'

export type PolicyTarget = 'label' | 'tabLabel'
export type PolicyAction = 'boost' | 'hide' | 'penalty'

export type ContextRule = {
  id: string
  target: PolicyTarget
  pattern: RegExp
  action: PolicyAction
  value: number
  reason: string
  roles?: ContextRole[]
  modes?: ContextMode[]
  maturities?: ContextMaturity[]
}

export const CONTEXT_POLICY_V1: ContextRule[] = [
  { id: 'core-overview', target: 'label', pattern: /overview|workflow|loop|diagram|chain|core/, action: 'boost', value: 70, reason: 'core-flow' },
  { id: 'exec-hide-tests', target: 'label', pattern: /test|unit|integration|e2e|uat|checklist/, action: 'hide', value: 0, reason: 'hidden-for-executive', roles: ['executive'] },
  { id: 'exec-hide-build', target: 'label', pattern: /template|click-by-click|build pack|tool mapping/, action: 'hide', value: 0, reason: 'hidden-for-executive', roles: ['executive'] },
  { id: 'exec-priority-kpi', target: 'label', pattern: /decision|kpi|risk|status|summary|truth|callout/, action: 'boost', value: 60, reason: 'executive-priority', roles: ['executive'] },
  { id: 'operator-priority-operate', target: 'label', pattern: /operating|stream|run|cadence|execution|handoff|status/, action: 'boost', value: 55, reason: 'operator-priority', roles: ['operator'] },
  { id: 'builder-priority-build', target: 'label', pattern: /build|template|test|unit|integration|e2e|uat|gate|checklist|tool|mapping/, action: 'boost', value: 75, reason: 'builder-priority', roles: ['builder'] },
  { id: 'overview-hide-build', target: 'label', pattern: /build|template|unit|integration|e2e|uat|checklist|mandatory sequence/, action: 'hide', value: 0, reason: 'hidden-in-overview', modes: ['overview'], roles: ['executive', 'operator'] },
  { id: 'overview-boost-core', target: 'label', pattern: /overview|workflow|loop|decision|risk|summary|truth/, action: 'boost', value: 40, reason: 'overview-focus', modes: ['overview'] },
  { id: 'operate-boost', target: 'label', pattern: /operating|run|stream|status|cadence|alerts|execution/, action: 'boost', value: 40, reason: 'operate-focus', modes: ['operate'] },
  { id: 'build-boost', target: 'label', pattern: /build|template|tool|mapping|test|integration|e2e|uat|gate/, action: 'boost', value: 45, reason: 'build-focus', modes: ['build'] },
  { id: 'foundation-innovation-penalty', target: 'tabLabel', pattern: /innovation|advanced|library/, action: 'penalty', value: 20, reason: 'foundation-penalty', maturities: ['foundation'] },
  { id: 'optimized-audit-boost', target: 'label', pattern: /audit|kpi|optimization|improvement/, action: 'boost', value: 15, reason: 'optimized-boost', maturities: ['optimized'] },
  { id: 'exec-finance-boost', target: 'label', pattern: /financial|revenue|margin|ebitda|fund/, action: 'boost', value: 25, reason: 'exec-financial', roles: ['executive'] },
  { id: 'exec-governance-boost', target: 'label', pattern: /governance|board|strategy|assumption/, action: 'boost', value: 25, reason: 'exec-governance', roles: ['executive'] },
  { id: 'operator-runbook-boost', target: 'label', pattern: /runbook|handoff|escalation|sla|throughput/, action: 'boost', value: 20, reason: 'operator-runbook', roles: ['operator'] },
  { id: 'operator-risk-boost', target: 'label', pattern: /incident|blocker|risk|issue/, action: 'boost', value: 25, reason: 'operator-risk', roles: ['operator'] },
  { id: 'builder-architecture-boost', target: 'label', pattern: /architecture|infrastructure|system|component/, action: 'boost', value: 25, reason: 'builder-architecture', roles: ['builder'] },
  { id: 'builder-qa-boost', target: 'label', pattern: /validation|verify|qa|quality|acceptance/, action: 'boost', value: 30, reason: 'builder-qa', roles: ['builder'] },
  { id: 'overview-hide-procedural', target: 'label', pattern: /step-by-step|click|phase gate|how to test/, action: 'hide', value: 0, reason: 'hidden-procedural', modes: ['overview'], roles: ['executive', 'operator'] },
  { id: 'build-hide-fluff', target: 'label', pattern: /welcome|affirmation|narrative|story/, action: 'penalty', value: 20, reason: 'build-penalty', modes: ['build'] },
  { id: 'operate-hide-fluff', target: 'label', pattern: /welcome|affirmation|narrative|story/, action: 'penalty', value: 15, reason: 'operate-penalty', modes: ['operate'] },
  { id: 'all-priority-callout', target: 'label', pattern: /truth|principle|universal/, action: 'boost', value: 20, reason: 'truth-priority' },
  { id: 'all-priority-diagram', target: 'label', pattern: /diagram|map|model/, action: 'boost', value: 18, reason: 'visual-priority' },
  { id: 'all-priority-why', target: 'label', pattern: /why this works|why real-time/, action: 'boost', value: 15, reason: 'why-priority' },
  { id: 'operator-ops-tab-boost', target: 'tabLabel', pattern: /execution|operations|delivery|qms|audit/, action: 'boost', value: 25, reason: 'operator-tab' },
  { id: 'builder-tech-tab-boost', target: 'tabLabel', pattern: /architecture|infrastructure|minios|value engines|build guides/, action: 'boost', value: 25, reason: 'builder-tab' },
  { id: 'exec-strategy-tab-boost', target: 'tabLabel', pattern: /strategy|framework|reporting|dashboard|change log/, action: 'boost', value: 22, reason: 'executive-tab' },
  { id: 'foundation-hide-advanced-tests', target: 'label', pattern: /advanced|deep dive|extended validation/, action: 'hide', value: 0, reason: 'foundation-simplify', maturities: ['foundation'], roles: ['executive', 'operator'] },
  { id: 'scaling-boost-standardization', target: 'label', pattern: /standard|template|baseline|repeatable/, action: 'boost', value: 18, reason: 'scaling-standardize', maturities: ['scaling'] },
  { id: 'optimized-boost-automation', target: 'label', pattern: /automation|autonomous|agentic|optimization/, action: 'boost', value: 18, reason: 'optimized-automation', maturities: ['optimized'] },
  { id: 'all-hide-empty', target: 'label', pattern: /^content$/i, action: 'penalty', value: 10, reason: 'generic-label-penalty' },
  { id: 'all-boost-compliance', target: 'label', pattern: /iso|compliance|security|control/, action: 'boost', value: 16, reason: 'compliance-priority' },
  { id: 'all-boost-metrics', target: 'label', pattern: /metric|kpi|measure|score|dashboard/, action: 'boost', value: 14, reason: 'metric-priority' },
  { id: 'operator-hide-contractual', target: 'label', pattern: /contract|commercial terms|bonus/, action: 'penalty', value: 12, reason: 'operator-contract-penalty', roles: ['operator'] },
  { id: 'builder-hide-board', target: 'label', pattern: /board|investor|fund launch/, action: 'penalty', value: 14, reason: 'builder-board-penalty', roles: ['builder'] },
  { id: 'executive-hide-lowlevel-ops', target: 'label', pattern: /api|endpoint|schema|payload|field mapping/, action: 'hide', value: 0, reason: 'hidden-lowlevel', roles: ['executive'] },
  { id: 'all-boost-roadmap', target: 'label', pattern: /roadmap|milestone|plan/, action: 'boost', value: 12, reason: 'roadmap-priority' },
]


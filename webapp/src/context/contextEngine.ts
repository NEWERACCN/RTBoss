import type { SectionGroup, SectionTab } from '../data/sectionTypes'
import type { ContextProfile } from './contextStore'
import { CONTEXT_POLICY_V1 } from './contextPolicy'

export type ContextDecision = {
  visible: boolean
  score: number
  reason: string
  matchedRules: string[]
}

export function evaluateGroupContext(profile: ContextProfile, tab: SectionTab, group: SectionGroup, index: number): ContextDecision {
  const label = (group.label || '').toLowerCase()
  const tabLabel = (tab.label || '').toLowerCase()
  let visible = true
  let score = index === 0 ? 15 : 0
  let reason = index === 0 ? 'first-group' : 'default'
  const matchedRules: string[] = []

  for (const rule of CONTEXT_POLICY_V1) {
    if (rule.roles && !rule.roles.includes(profile.role)) continue
    if (rule.modes && !rule.modes.includes(profile.mode)) continue
    if (rule.maturities && !rule.maturities.includes(profile.maturity)) continue

    const source = rule.target === 'tabLabel' ? tabLabel : label
    if (!rule.pattern.test(source)) continue

    matchedRules.push(rule.id)
    reason = rule.reason

    if (rule.action === 'hide') visible = false
    if (rule.action === 'boost') score += rule.value
    if (rule.action === 'penalty') score -= rule.value
  }

  return { visible, score, reason, matchedRules }
}

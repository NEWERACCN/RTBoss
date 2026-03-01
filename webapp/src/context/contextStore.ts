import { useSyncExternalStore } from 'react'
import { CONTEXT_PRESETS, SECTION_DEFAULT_PROFILES, type ContextPresetId } from './contextProfiles'

export type ContextRole = 'executive' | 'operator' | 'builder'
export type ContextMode = 'overview' | 'operate' | 'build'
export type ContextMaturity = 'foundation' | 'scaling' | 'optimized'

export type ContextProfile = {
  role: ContextRole
  mode: ContextMode
  maturity: ContextMaturity
}

type ContextState = {
  profile: ContextProfile
  presetId: ContextPresetId
}

type Listener = () => void

const listeners = new Set<Listener>()
const STORAGE_KEY = 'LiveOpsOS.context.v1'

function getInitialState(): ContextState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as ContextState
    } catch {
      // ignore malformed persisted state
    }
  }
  return {
    profile: { role: 'executive', mode: 'overview', maturity: 'foundation' },
    presetId: 'custom',
  }
}

let state: ContextState = getInitialState()

function emit() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  listeners.forEach((listener) => listener())
}

export function setContextProfile(patch: Partial<ContextProfile>) {
  state = { profile: { ...state.profile, ...patch }, presetId: 'custom' }
  emit()
}

export function applyContextPreset(presetId: Exclude<ContextPresetId, 'custom' | 'section-default'>) {
  state = { profile: CONTEXT_PRESETS[presetId], presetId }
  emit()
}

export function applySectionDefaultContext(slug: string) {
  const profile = SECTION_DEFAULT_PROFILES[slug]
  if (!profile) return
  state = { profile, presetId: 'section-default' }
  emit()
}

export function useContextProfile() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state.profile,
    () => state.profile,
  )
}

export function useContextPresetId() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state.presetId,
    () => state.presetId,
  )
}


import { useMemo, useSyncExternalStore } from 'react'
import type { SectionContent, SectionGroup, SectionTab } from './sectionTypes'

type Listener = () => void

type SectionDelta =
  | { type: 'section_upsert'; section: SectionContent }
  | { type: 'section_remove'; slug: string }
  | { type: 'tab_upsert'; slug: string; tab: SectionTab }
  | { type: 'tab_remove'; slug: string; tabId: string }
  | { type: 'group_patch'; slug: string; tabId: string; groupIndex: number; group: Partial<SectionGroup> }

const sectionStore = new Map<string, SectionContent>()
const sectionLoading = new Map<string, Promise<void>>()

const sectionListeners = new Map<string, Set<Listener>>()

function notifySection(slug: string) {
  sectionListeners.get(slug)?.forEach((listener) => listener())
}

function getSection(slug: string) {
  return sectionStore.get(slug)
}

function setSection(slug: string, section: SectionContent) {
  sectionStore.set(slug, section)
  notifySection(slug)
}

async function loadSection(slug: string) {
  const response = await fetch(`/data/sections/${slug}.json`)
  if (!response.ok) return
  const section = (await response.json()) as SectionContent
  setSection(slug, section)
}

function ensureSectionLoaded(slug: string) {
  if (!slug || sectionStore.has(slug) || sectionLoading.has(slug)) return
  const pending = loadSection(slug)
    .catch(() => undefined)
    .finally(() => {
      sectionLoading.delete(slug)
      notifySection(slug)
    })
  sectionLoading.set(slug, pending)
}

function patchTab(section: SectionContent, tabId: string, updater: (tab: SectionTab) => SectionTab): SectionContent {
  return {
    ...section,
    tabs: section.tabs.map((tab) => (tab.id === tabId ? updater(tab) : tab)),
  }
}

export function applySectionDelta(delta: SectionDelta) {
  if (delta.type === 'section_upsert') {
    setSection(delta.section.slug, delta.section)
    return
  }

  if (delta.type === 'section_remove') {
    sectionStore.delete(delta.slug)
    notifySection(delta.slug)
    return
  }

  const section = getSection(delta.slug)
  if (!section) return

  if (delta.type === 'tab_upsert') {
    const tabExists = section.tabs.some((tab) => tab.id === delta.tab.id)
    setSection(
      section.slug,
      tabExists
        ? patchTab(section, delta.tab.id, () => delta.tab)
        : { ...section, tabs: [...section.tabs, delta.tab] },
    )
    return
  }

  if (delta.type === 'tab_remove') {
    setSection(section.slug, { ...section, tabs: section.tabs.filter((tab) => tab.id !== delta.tabId) })
    return
  }

  if (delta.type === 'group_patch') {
    setSection(
      section.slug,
      patchTab(section, delta.tabId, (tab) => ({
        ...tab,
        groups: tab.groups.map((group, index) =>
          index === delta.groupIndex
            ? {
                ...group,
                ...delta.group,
              }
            : group,
        ),
      })),
    )
  }
}

export function subscribeToSection(slug: string, listener: Listener) {
  ensureSectionLoaded(slug)
  const listeners = sectionListeners.get(slug) ?? new Set<Listener>()
  listeners.add(listener)
  sectionListeners.set(slug, listeners)

  return () => {
    const target = sectionListeners.get(slug)
    if (!target) return
    target.delete(listener)
    if (target.size === 0) {
      sectionListeners.delete(slug)
    }
  }
}

export function useSectionSubscription(slug: string) {
  ensureSectionLoaded(slug)
  return useSyncExternalStore(
    (listener) => subscribeToSection(slug, listener),
    () => getSection(slug),
    () => getSection(slug),
  )
}

export function useSectionTabSubscription(slug: string, tabId?: string) {
  const section = useSectionSubscription(slug)
  return useMemo(() => {
    if (!section || !tabId) return undefined
    return section.tabs.find((tab) => tab.id === tabId)
  }, [section, tabId])
}

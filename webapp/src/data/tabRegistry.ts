export type ChecklistItem = {
  id: string
  label: string
  done: boolean
}

export type TabRegistryEntry = {
  tabId: string
  tabName: string
  contentChecklist: ChecklistItem[]
  toolsChecklist: ChecklistItem[]
  implementationChecklist: ChecklistItem[]
}

export const tab_registry: Record<string, TabRegistryEntry[]> = {
  strategy: [
    {
      tabId: 'tab-1',
      tabName: 'LiveOpsOS Core',
      contentChecklist: [
        { id: 'core-c-01', label: 'Core definition', done: false },
        { id: 'core-c-02', label: 'Operating chain text', done: false },
        { id: 'core-c-03', label: 'Loop explanations', done: false },
        { id: 'core-c-04', label: 'Business value statement', done: false },
      ],
      toolsChecklist: [
        { id: 'core-t-01', label: 'Personas defined', done: false },
        { id: 'core-t-02', label: 'Rules configured', done: false },
        { id: 'core-t-03', label: 'Orchestration mapped', done: false },
        { id: 'core-t-04', label: 'Capabilities aligned', done: false },
      ],
      implementationChecklist: [
        { id: 'core-i-01', label: 'Personas live', done: false },
        { id: 'core-i-02', label: 'Agents running', done: false },
        { id: 'core-i-03', label: 'Signals flowing', done: false },
        { id: 'core-i-04', label: 'Client live validation', done: false },
      ],
    },
    {
      tabId: 'tab-2',
      tabName: 'Strategic Pillars',
      contentChecklist: [
        { id: 'pillars-c-01', label: 'Pillars defined', done: false },
        { id: 'pillars-c-02', label: 'Pillar explanations', done: false },
        { id: 'pillars-c-03', label: 'Pillar definitions', done: false },
        { id: 'pillars-c-04', label: 'Pillar card clarity', done: false },
      ],
      toolsChecklist: [
        { id: 'pillars-t-01', label: 'Persona mapping', done: false },
        { id: 'pillars-t-02', label: 'Rules mapped', done: false },
        { id: 'pillars-t-03', label: 'Agent flow linked', done: false },
        { id: 'pillars-t-04', label: 'Capability map set', done: false },
      ],
      implementationChecklist: [
        { id: 'pillars-i-01', label: 'Personas active', done: false },
        { id: 'pillars-i-02', label: 'Agents active', done: false },
        { id: 'pillars-i-03', label: 'Signals active', done: false },
        { id: 'pillars-i-04', label: 'Client run confirmed', done: false },
      ],
    },
    {
      tabId: 'tab-3',
      tabName: 'Transformation Fund',
      contentChecklist: [
        { id: 'fund-c-01', label: 'Fund narrative', done: false },
        { id: 'fund-c-02', label: 'Fund explanation', done: false },
        { id: 'fund-c-03', label: 'Fund definitions', done: false },
        { id: 'fund-c-04', label: 'Card-level clarity', done: false },
      ],
      toolsChecklist: [
        { id: 'fund-t-01', label: 'Persona setup', done: false },
        { id: 'fund-t-02', label: 'Rule setup', done: false },
        { id: 'fund-t-03', label: 'Orchestration setup', done: false },
        { id: 'fund-t-04', label: 'Capability setup', done: false },
      ],
      implementationChecklist: [
        { id: 'fund-i-01', label: 'Personas live', done: false },
        { id: 'fund-i-02', label: 'Agents live', done: false },
        { id: 'fund-i-03', label: 'Signals live', done: false },
        { id: 'fund-i-04', label: 'Client live confirmed', done: false },
      ],
    },
    {
      tabId: 'tab-4',
      tabName: 'Revenue Model',
      contentChecklist: [
        { id: 'rev-c-01', label: 'Revenue narrative', done: false },
        { id: 'rev-c-02', label: 'Revenue explanation', done: false },
        { id: 'rev-c-03', label: 'Revenue definitions', done: false },
        { id: 'rev-c-04', label: 'Card-level clarity', done: false },
      ],
      toolsChecklist: [
        { id: 'rev-t-01', label: 'Persona setup', done: false },
        { id: 'rev-t-02', label: 'Rule setup', done: false },
        { id: 'rev-t-03', label: 'Orchestration setup', done: false },
        { id: 'rev-t-04', label: 'Capability setup', done: false },
      ],
      implementationChecklist: [
        { id: 'rev-i-01', label: 'Personas live', done: false },
        { id: 'rev-i-02', label: 'Agents live', done: false },
        { id: 'rev-i-03', label: 'Signals live', done: false },
        { id: 'rev-i-04', label: 'Client live confirmed', done: false },
      ],
    },
    {
      tabId: 'tab-5',
      tabName: 'The Flywheel',
      contentChecklist: [
        { id: 'fly-c-01', label: 'Flywheel narrative', done: false },
        { id: 'fly-c-02', label: 'Flywheel explanation', done: false },
        { id: 'fly-c-03', label: 'Flywheel definitions', done: false },
        { id: 'fly-c-04', label: 'Card-level clarity', done: false },
      ],
      toolsChecklist: [
        { id: 'fly-t-01', label: 'Persona setup', done: false },
        { id: 'fly-t-02', label: 'Rule setup', done: false },
        { id: 'fly-t-03', label: 'Orchestration setup', done: false },
        { id: 'fly-t-04', label: 'Capability setup', done: false },
      ],
      implementationChecklist: [
        { id: 'fly-i-01', label: 'Personas live', done: false },
        { id: 'fly-i-02', label: 'Agents live', done: false },
        { id: 'fly-i-03', label: 'Signals live', done: false },
        { id: 'fly-i-04', label: 'Client live confirmed', done: false },
      ],
    },
  ],
}

export type TabChecklistKind = 'content' | 'tools' | 'implementation'

type TabProgressState = {
  version: 2
  updatedAt: string
  tabs: Record<
    string,
    {
      content: Record<string, { done: boolean }>
      tools: Record<string, { done: boolean }>
      implementation: Record<string, { done: boolean }>
      contentSignals: Record<string, { done: boolean }>
    }
  >
}

const STORAGE_KEY = 'liveopsos_tab_registry_progress_v2'
const LEGACY_STORAGE_KEY = 'liveopsos_tab_registry_progress_v1'

function emptyProgressState(): TabProgressState {
  return {
    version: 2,
    updatedAt: new Date().toISOString(),
    tabs: {},
  }
}

function migrateLegacyState(raw: string | null): TabProgressState {
  if (!raw) return emptyProgressState()
  try {
    const parsed = JSON.parse(raw) as {
      tabs?: Record<string, { content?: Record<string, { done: boolean }>; implementation?: Record<string, { done: boolean }> }>
    }
    const migrated = emptyProgressState()
    for (const [key, value] of Object.entries(parsed.tabs ?? {})) {
      migrated.tabs[key] = {
        content: value.content ?? {},
        tools: {},
        implementation: value.implementation ?? {},
        contentSignals: {},
      }
    }
    return migrated
  } catch {
    return emptyProgressState()
  }
}

export function readTabProgressState(): TabProgressState {
  if (typeof window === 'undefined') return emptyProgressState()
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<TabProgressState>
    if (!parsed || parsed.version !== 2 || !parsed.tabs) {
      const migrated = migrateLegacyState(window.localStorage.getItem(LEGACY_STORAGE_KEY))
      writeTabProgressState(migrated)
      return migrated
    }
    const normalizedTabs = Object.fromEntries(
      Object.entries(parsed.tabs).map(([key, value]) => [
        key,
        {
          content: value.content ?? {},
          tools: value.tools ?? {},
          implementation: value.implementation ?? {},
          contentSignals: value.contentSignals ?? {},
        },
      ]),
    )
    return {
      version: 2,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      tabs: normalizedTabs,
    }
  } catch {
    const migrated = migrateLegacyState(window.localStorage.getItem(LEGACY_STORAGE_KEY))
    writeTabProgressState(migrated)
    return migrated
  }
}

export function writeTabProgressState(state: TabProgressState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      version: 2,
      updatedAt: new Date().toISOString(),
    }),
  )
}

function tabProgressKey(slug: string, tabId: string) {
  return `${slug}:${tabId}`
}

function createDefaultEntry(tabId: string, tabName: string): TabRegistryEntry {
  return {
    tabId,
    tabName,
    contentChecklist: [
      { id: `${tabId}-c-01`, label: 'Content complete', done: false },
      { id: `${tabId}-c-02`, label: 'Explanations complete', done: false },
      { id: `${tabId}-c-03`, label: 'Definitions complete', done: false },
    ],
    toolsChecklist: [
      { id: `${tabId}-t-01`, label: 'Personas setup', done: false },
      { id: `${tabId}-t-02`, label: 'Rules setup', done: false },
      { id: `${tabId}-t-03`, label: 'Orchestration setup', done: false },
    ],
    implementationChecklist: [
      { id: `${tabId}-i-01`, label: 'Personas live', done: false },
      { id: `${tabId}-i-02`, label: 'Agents running', done: false },
      { id: `${tabId}-i-03`, label: 'Signals flowing', done: false },
    ],
  }
}

export function getRegistryEntry(slug: string, tabId: string, tabName = tabId) {
  return tab_registry[slug]?.find((tab) => tab.tabId === tabId) ?? createDefaultEntry(tabId, tabName)
}

function applyProgressToChecklist(
  checklist: ChecklistItem[],
  progressMap: Record<string, { done: boolean }> | undefined,
) {
  return checklist.map((item) => {
    const progress = progressMap?.[item.id]
    return {
      ...item,
      done: progress?.done ?? item.done,
    }
  })
}

function completionPct(items: ChecklistItem[]) {
  if (items.length === 0) return 0
  const done = items.filter((item) => item.done).length
  return Math.round((done / items.length) * 100)
}

export function getTabMetrics(slug: string, tabId: string, tabName = tabId, progressState = readTabProgressState()) {
  const entry = getRegistryEntry(slug, tabId, tabName)
  const progress = progressState.tabs[tabProgressKey(slug, tabId)]
  const contentItems = applyProgressToChecklist(entry.contentChecklist, progress?.content)
  const toolsItems = applyProgressToChecklist(entry.toolsChecklist, progress?.tools)
  const implementationItems = applyProgressToChecklist(entry.implementationChecklist, progress?.implementation)
  return {
    entry,
    contentItems,
    toolsItems,
    implementationItems,
    contentCompletion: completionPct(contentItems),
    toolsCompletion: completionPct(toolsItems),
    implementationCompletion: completionPct(implementationItems),
  }
}

export function getSectionMetrics(
  slug: string,
  tabs: Array<{ id: string; label: string }>,
  progressState = readTabProgressState(),
) {
  if (tabs.length === 0) return { contentCompletion: 0, toolsCompletion: 0, implementationCompletion: 0 }
  const perTab = tabs.map((tab) => getTabMetrics(slug, tab.id, tab.label, progressState))
  const contentCompletion = Math.round(perTab.reduce((sum, item) => sum + item.contentCompletion, 0) / perTab.length)
  const toolsCompletion = Math.round(perTab.reduce((sum, item) => sum + item.toolsCompletion, 0) / perTab.length)
  const implementationCompletion = Math.round(
    perTab.reduce((sum, item) => sum + item.implementationCompletion, 0) / perTab.length,
  )
  return { contentCompletion, toolsCompletion, implementationCompletion }
}

export function setChecklistItemDone(
  slug: string,
  tabId: string,
  kind: TabChecklistKind,
  itemId: string,
  done: boolean,
) {
  const state = readTabProgressState()
  const key = tabProgressKey(slug, tabId)
  const target = state.tabs[key] ?? { content: {}, tools: {}, implementation: {}, contentSignals: {} }
  const kindMap = kind === 'content' ? target.content : kind === 'tools' ? target.tools : target.implementation
  kindMap[itemId] = { done }
  state.tabs[key] = target
  writeTabProgressState(state)
  return state
}

function contentSignalDefinition(groupCount: number) {
  const signals = [
    { id: 'header', label: 'Header' },
    { id: 'diagram', label: 'Diagram' },
    { id: 'liveops', label: 'LiveOps' },
    { id: 'footer', label: 'Footer' },
  ]
  for (let i = 0; i < groupCount; i += 1) {
    signals.push({ id: `group-${i}`, label: `Group ${i + 1}` })
  }
  return signals
}

export function getContentMetrics(slug: string, tabId: string, groupCount: number, progressState = readTabProgressState()) {
  const key = tabProgressKey(slug, tabId)
  const tab = progressState.tabs[key] ?? { contentSignals: {} }
  const definitions = contentSignalDefinition(groupCount)
  const items = definitions.map((item) => ({
    ...item,
    done: tab.contentSignals?.[item.id]?.done ?? false,
  }))
  const done = items.filter((item) => item.done).length
  const total = items.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return { items, done, total, pct }
}

export function setContentSignalDone(slug: string, tabId: string, signalId: string, done: boolean) {
  const state = readTabProgressState()
  const key = tabProgressKey(slug, tabId)
  const target = state.tabs[key] ?? { content: {}, tools: {}, implementation: {}, contentSignals: {} }
  target.contentSignals[signalId] = { done }
  state.tabs[key] = target
  writeTabProgressState(state)
  return state
}

export function exportTabProgress() {
  return JSON.stringify(readTabProgressState(), null, 2)
}

export function importTabProgress(payload: string) {
  try {
    const parsed = JSON.parse(payload) as TabProgressState
    if (parsed.version !== 2 || !parsed.tabs) return false
    writeTabProgressState({
      version: 2,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      tabs: parsed.tabs,
    })
    return true
  } catch {
    return false
  }
}


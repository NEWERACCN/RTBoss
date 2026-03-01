import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { SectionContent } from '../data/sectionTypes'
import { subjects } from '../data/subjects'

type ProgressStore = Record<string, Record<string, boolean>>
type TwinEvent = {
  id: string
  ts: number
  message: string
}

const PROGRESS_KEY = 'LiveOpsOS_content_progress_v1'
const EVENT_KEY = 'LiveOpsOS_content_events_v1'

function splitTabLabel(label: string, fallback: number) {
  const normalized = label.replace(/\u00C2/g, '').trim()
  const match = normalized.match(/^(\d{1,2})\s*[\u00B7-]\s*(.+)$/)
  if (!match) {
    return { number: String(fallback + 1).padStart(2, '0'), text: normalized }
  }
  return { number: match[1].padStart(2, '0'), text: match[2] }
}

function readProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? '{}') as ProgressStore
  } catch {
    return {} as ProgressStore
  }
}

function writeProgress(progress: ProgressStore) {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

function readEvents() {
  try {
    return JSON.parse(window.localStorage.getItem(EVENT_KEY) ?? '[]') as TwinEvent[]
  } catch {
    return [] as TwinEvent[]
  }
}

function writeEvents(events: TwinEvent[]) {
  window.localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(0, 80)))
}

function sectionStatus(pct: number) {
  if (pct <= 0) return 'Not Started'
  if (pct < 0.8) return 'In Progress'
  return 'Healthy'
}

function sectionStatusClass(pct: number) {
  if (pct <= 0) return 'stop'
  if (pct < 0.8) return 'risk'
  return 'run'
}

export function LiveSnapshotPage() {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<SectionContent[]>([])
  const [progress, setProgress] = useState<ProgressStore>({})
  const [events, setEvents] = useState<TwinEvent[]>([])
  const [selected, setSelected] = useState<{ slug: string; tabId: string } | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      const payload = await Promise.all(
        subjects.map(async (subject) => {
          const response = await fetch(`/data/sections/${subject.slug}.json`)
          if (!response.ok) return null
          return (await response.json()) as SectionContent
        }),
      )
      if (!active) return
      const resolved = payload.filter((item): item is SectionContent => Boolean(item))
      setSections(resolved)
      setLoading(false)
    }
    load().catch(() => {
      if (!active) return
      setSections([])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setProgress(readProgress())
    setEvents(readEvents())
    const onStorage = (event: StorageEvent) => {
      if (event.key === PROGRESS_KEY) setProgress(readProgress())
      if (event.key === EVENT_KEY) setEvents(readEvents())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const sectionRows = useMemo(() => {
    return sections.map((section) => {
      const done = section.tabs.reduce((sum, tab) => {
        return (
          sum +
          tab.groups.reduce((tabSum, _, groupIndex) => {
            const key = `${tab.id}:${groupIndex}`
            return tabSum + (progress[section.slug]?.[key] ? 1 : 0)
          }, 0)
        )
      }, 0)
      const total = section.tabs.reduce((sum, tab) => sum + tab.groups.length, 0)
      const pct = total > 0 ? done / total : 0
      return {
        section,
        done,
        total,
        pct,
      }
    })
  }, [sections, progress])

  const totals = useMemo(() => {
    const sectionsTracked = sectionRows.length
    const tabsTracked = sectionRows.reduce((sum, row) => sum + row.section.tabs.length, 0)
    const groupsTracked = sectionRows.reduce((sum, row) => sum + row.total, 0)
    const groupsDone = sectionRows.reduce((sum, row) => sum + row.done, 0)
    const progressPct = groupsTracked > 0 ? Math.round((groupsDone / groupsTracked) * 100) : 0
    return {
      sectionsTracked,
      tabsTracked,
      groupsTracked,
      groupsDone,
      progressPct,
    }
  }, [sectionRows])

  const selectedTab = useMemo(() => {
    if (!selected) return undefined
    const section = sections.find((item) => item.slug === selected.slug)
    if (!section) return undefined
    const tab = section.tabs.find((item) => item.id === selected.tabId)
    if (!tab) return undefined
    return { section, tab }
  }, [sections, selected])

  useEffect(() => {
    if (selected) return
    const firstSection = sections[0]
    if (!firstSection || firstSection.tabs.length === 0) return
    setSelected({ slug: firstSection.slug, tabId: firstSection.tabs[0].id })
  }, [sections, selected])

  const toggleGroup = (slug: string, tabId: string, groupIndex: number, checked: boolean) => {
    const key = `${tabId}:${groupIndex}`
    const next = {
      ...progress,
      [slug]: {
        ...(progress[slug] ?? {}),
        [key]: checked,
      },
    }
    setProgress(next)
    writeProgress(next)
    const section = sections.find((item) => item.slug === slug)
    const tab = section?.tabs.find((item) => item.id === tabId)
    const group = tab?.groups[groupIndex]
    const nextEvents = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        message: `${checked ? 'Marked' : 'Unmarked'} ${section?.slug ?? slug} / ${tab?.label ?? tabId} / ${group?.label ?? `Group ${groupIndex + 1}`}`,
      },
      ...events,
    ]
    setEvents(nextEvents.slice(0, 80))
    writeEvents(nextEvents)
  }

  if (loading) {
    return (
      <section className="surface panel-l2 live-snapshot-shell">
        <p className="muted">Loading LiveSnap Shot content twin...</p>
      </section>
    )
  }

  return (
    <section className="content-stack live-snapshot-root">
      <section className="surface panel-l2 live-snapshot-shell">
        <header className="live-snapshot-hero">
          <div>
            <p className="mission-kicker">LIVE SNAP SHOT // CONTENT TWIN</p>
            <h1>LiveSnap Shot</h1>
            <p className="muted">Tracks content completion for every section, tab, and group in one command surface.</p>
          </div>
          <div className="live-snapshot-metrics">
            <span className="mission-chip">Sections {totals.sectionsTracked}</span>
            <span className="mission-chip">Tabs {totals.tabsTracked}</span>
            <span className="mission-chip">Groups {totals.groupsDone}/{totals.groupsTracked}</span>
            <span className="mission-chip">Completion {totals.progressPct}%</span>
          </div>
        </header>

        <div className="live-snapshot-main">
          <section className="live-snapshot-floor">
            <div className="live-snapshot-floor-head">
              <p className="live-snapshot-floor-title">Content Floor</p>
              <span className="mission-chip">Section / Tab / Group</span>
            </div>
            <div className="live-snapshot-lanes">
              {sectionRows.map((row) => (
                <article key={row.section.slug} className="live-snapshot-lane">
                  <div className="live-snapshot-lane-top">
                    <strong>{row.section.title}</strong>
                    <span className={`badge b-${sectionStatusClass(row.pct)}`}>{sectionStatus(row.pct)}</span>
                  </div>
                  <p className="live-snapshot-lane-meta">
                    {row.done}/{row.total} groups complete
                  </p>
                  <div className="live-snapshot-progress">
                    <span style={{ width: `${Math.max(4, Math.round(row.pct * 100))}%` }} />
                  </div>
                  <div className="live-snapshot-tabs">
                    {row.section.tabs.map((tab, index) => {
                      const parsed = splitTabLabel(tab.label, index)
                      const tabDone = tab.groups.reduce((sum, _, groupIndex) => {
                        const key = `${tab.id}:${groupIndex}`
                        return sum + (progress[row.section.slug]?.[key] ? 1 : 0)
                      }, 0)
                      const tabPct = tab.groups.length > 0 ? tabDone / tab.groups.length : 0
                      const isSelected = selected?.slug === row.section.slug && selected?.tabId === tab.id
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          className={`live-snapshot-tab ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelected({ slug: row.section.slug, tabId: tab.id })}
                        >
                          <span>{parsed.number}</span>
                          <strong>{parsed.text}</strong>
                          <em>
                            {tabDone}/{tab.groups.length}
                          </em>
                          <i className={`badge b-${sectionStatusClass(tabPct)}`}>{sectionStatus(tabPct)}</i>
                        </button>
                      )
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="live-snapshot-side">
            <section className="surface panel-l3 live-snapshot-panel">
              <div className="live-snapshot-floor-head">
                <p className="live-snapshot-floor-title">Group Tracker</p>
                {selectedTab && (
                  <Link className="ghost-link" to={`/subject/${selectedTab.section.slug}/${selectedTab.tab.id}`}>
                    Open Tab
                  </Link>
                )}
              </div>
              {selectedTab ? (
                <div className="live-snapshot-group-list">
                  <p className="live-snapshot-selected-title">
                    {selectedTab.section.title} // {selectedTab.tab.label}
                  </p>
                  {selectedTab.tab.groups.map((group, groupIndex) => {
                    const key = `${selectedTab.tab.id}:${groupIndex}`
                    const checked = Boolean(progress[selectedTab.section.slug]?.[key])
                    return (
                      <label key={key} className="live-snapshot-group-item">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) =>
                            toggleGroup(selectedTab.section.slug, selectedTab.tab.id, groupIndex, event.target.checked)
                          }
                        />
                        <span>{group.label}</span>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <p className="muted">Select a tab on the left to track groups.</p>
              )}
            </section>

            <section className="surface panel-l3 live-snapshot-panel">
              <div className="live-snapshot-floor-head">
                <p className="live-snapshot-floor-title">Event Log</p>
                <span className="mission-chip">latest 80</span>
              </div>
              <div className="live-snapshot-events">
                {events.length === 0 && <p className="muted">No group tracking events yet.</p>}
                {events.map((event) => (
                  <div key={event.id} className="live-snapshot-event-row">
                    <span>{new Date(event.ts).toLocaleString()}</span>
                    <p>{event.message}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </section>
  )
}

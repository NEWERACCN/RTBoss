import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QmsStyleGuide } from '../components/QmsStyleGuide'
import { evaluateGroupContext } from '../context/contextEngine'
import { applySectionDefaultContext, useContextProfile } from '../context/contextStore'
import { applySectionDelta, useSectionSubscription, useSectionTabSubscription } from '../data/sectionRealtime'
import { getSubjectBySlug } from '../data/subjects'
import {
  getContentMetrics,
  getTabMetrics,
  readTabProgressState,
  setContentSignalDone,
} from '../data/tabRegistry'
import { LiveSnapshotPage } from './LiveSnapshotPage'

function splitTabLabel(label: string, fallback: number) {
  const normalized = label.replace(/\u00C2/g, '').trim()
  const match = normalized.match(/^(\d{1,2})\s*[\u00B7-]\s*(.+)$/)
  if (!match) {
    return { number: String(fallback + 1).padStart(2, '0'), text: normalized }
  }
  return { number: match[1].padStart(2, '0'), text: match[2] }
}

function isWideGroup(label: string, index: number) {
  if (index === 0) return true
  if (/^footer$/i.test(label) || /^universal truth$/i.test(label)) return true
  return /overview|workflow|loop|callout|truth|diagram|chain/i.test(label)
}

export function SubjectPage() {
  const { slug = '', tabId = '' } = useParams()
  const subject = getSubjectBySlug(slug)
  const context = useContextProfile()
  const [tabProgress, setTabProgress] = useState(readTabProgressState())
  const sectionContent = useSectionSubscription(slug)
  const selectedTab = useSectionTabSubscription(slug, tabId)

  useEffect(() => {
    if (slug) applySectionDefaultContext(slug)
  }, [slug])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'liveopsos_tab_registry_progress_v2') {
        setTabProgress(readTabProgressState())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const contextualGroups = useMemo(() => {
    if (!selectedTab) return []
    const priorityForLabel = (label: string) => {
      if (slug === 'strategy' && selectedTab.id === 'tab-1') {
        if (label === 'Overview') return 4
        if (label === 'Core Elements') return 3
        if (label === 'The Operating Loop') return 2
        if (label === 'Why LiveOps Operating System Works for Any Business') return 1
        if (label === 'Footer') return -1
        if (label === 'Universal Truth') return -1
      }
      return 0
    }

    return selectedTab.groups
      .map((group, index) => ({
        group,
        index,
        decision: evaluateGroupContext(context, selectedTab, group, index),
      }))
      .sort((a, b) => {
        const priorityDelta = priorityForLabel(b.group.label) - priorityForLabel(a.group.label)
        if (priorityDelta !== 0) return priorityDelta
        return b.decision.score - a.decision.score || a.index - b.index
      })
  }, [context, selectedTab])

  const visibleContextualGroups = useMemo(
    () => contextualGroups.filter((item) => item.decision.visible),
    [contextualGroups],
  )

  const hiddenCount = selectedTab ? selectedTab.groups.length - visibleContextualGroups.length : 0

  if (!subject) {
    return (
      <section className="content-stack">
        <div className="hero-panel">
          <p className="pill">Missing Subject</p>
          <h1>This subject is not defined yet.</h1>
          <p className="muted">Select another item from the left sidebar to continue.</p>
        </div>
      </section>
    )
  }

  if (!sectionContent) {
    return (
      <section className="content-stack">
        <div className="hero-panel">
          <p className="pill">Loading</p>
          <h1>{subject.title}</h1>
          <p className="muted">Loading section content...</p>
        </div>
      </section>
    )
  }

  if (slug === 'reporting-dashboard') {
    return (
      <section className="content-stack">
        <LiveSnapshotPage />
      </section>
    )
  }

  const contentOnlyMode = slug === 'strategy'
  const sectionContentMetrics = sectionContent.tabs.map((tab) =>
    getContentMetrics(slug, tab.id, tab.groups.length, tabProgress),
  )
  const totalGroupsInSection = sectionContent.tabs.reduce((sum, tab) => sum + tab.groups.length, 0)

  const contentCompletion =
    sectionContentMetrics.length > 0
      ? Math.round(sectionContentMetrics.reduce((sum, item) => sum + item.pct, 0) / sectionContentMetrics.length)
      : 0

  const selectedTabContentMetrics = selectedTab
    ? getContentMetrics(slug, selectedTab.id, selectedTab.groups.length, tabProgress)
    : undefined
  const selectedTabStageMetrics = selectedTab ? getTabMetrics(slug, selectedTab.id, selectedTab.label, tabProgress) : undefined

  const setAllContentSignals = (done: boolean) => {
    if (!selectedTabContentMetrics || !selectedTab) return
    let nextState = tabProgress
    selectedTabContentMetrics.items.forEach((item) => {
      nextState = setContentSignalDone(slug, selectedTab.id, item.id, done)
    })
    setTabProgress(nextState)
  }

  return (
    <section className="content-stack">
      <section className="surface panel-l2 unified-header">
        <div className="unified-header-top">
          <div className="unified-title-wrap">
            <span className="counter-chip">{subject.code} Section</span>
            <h1>{subject.title}</h1>
            {!selectedTab && <p className="muted">{subject.purpose}</p>}
          </div>
          {selectedTab && (
            <Link className="ghost-link" to={`/subject/${slug}`}>
              Back to Tabs
            </Link>
          )}
        </div>
        <div className="unified-header-chips">
          <span className={`counter-chip meta-accent-chip meta-status-chip ${subject.complete ? 'ok' : 'pending'}`}>
            <strong>{subject.complete ? 'Live - Complete' : 'Live - In Progress'}</strong>
          </span>
          <span className="counter-chip meta-accent-chip meta-secondary-chip">
            <strong>{subject.category}</strong>
          </span>
          <span className="counter-chip meta-accent-chip meta-secondary-chip">
            <strong>{subject.workstream}</strong>
          </span>
        </div>

        {selectedTab && (
          <>
            <div className="subject-tab-stats-row">
              <span className="counter-chip">
                Tabs <strong>{sectionContent.tabs.length}</strong>
              </span>
              <span className="counter-chip">
                Groups <strong>{totalGroupsInSection}</strong>
              </span>
              <span className="counter-chip">
                Content <strong>{contentCompletion}%</strong>
              </span>
            </div>
            <nav className="subject-tab-jump" aria-label="Tab jump">
              {sectionContent.tabs.map((tab, index) => {
                const parsed = splitTabLabel(tab.label, index)
                return (
                  <Link
                    key={tab.id}
                    to={`/subject/${slug}/${tab.id}`}
                    className={`subject-tab-chip ${tab.id === selectedTab.id ? 'active' : ''}`}
                  >
                    {parsed.number} {parsed.text}
                  </Link>
                )
              })}
            </nav>

          </>
        )}
      </section>

      {!selectedTab && (
        <section className="surface panel-l2 wireframe-board">
          <div className="wireframe-controls">
            <input className="topbar-search wireframe-search" placeholder="Search tabs..." />
            <button type="button" className="ghost-link">
              Filter
            </button>
            <button type="button" className="ghost-link">
              Sort
            </button>
            <div className="wireframe-tabs">
              <span className="tab-status in-progress">All</span>
              <span className="tab-status">Core</span>
              <span className="tab-status">Tools</span>
              <span className="tab-status">Ops</span>
            </div>
          </div>

          <div className="tab-card-grid">
            {sectionContent.tabs.map((tab, index) => {
              const parsed = splitTabLabel(tab.label, index)
              const metrics = getTabMetrics(slug, tab.id, tab.label, tabProgress)
              const contentMetrics = getContentMetrics(slug, tab.id, tab.groups.length, tabProgress)
              const isGreen = contentOnlyMode
                ? contentMetrics.pct >= 80
                : contentMetrics.pct >= 80 && metrics.toolsCompletion >= 80 && metrics.implementationCompletion >= 80
              const isRed = contentOnlyMode
                ? contentMetrics.pct < 50
                : contentMetrics.pct < 50 || metrics.toolsCompletion < 50 || metrics.implementationCompletion < 50
              const statusClass = isGreen ? 'green' : isRed ? 'red' : 'yellow'
              return (
                <Link key={tab.id} to={`/subject/${slug}/${tab.id}`} className="tab-card panel-l3 tab-card-link">
                  <div className="tab-card-head">
                    <p className="tab-card-number">Tab {parsed.number}</p>
                    <span className={`tab-health-dot ${statusClass}`} aria-label={`Status ${statusClass}`} />
                  </div>
                  <p className="tab-card-title">{parsed.text}</p>
                  <div className="tab-card-metrics-stack">
                    <p className="tab-card-metrics metric-content">Content: {contentMetrics.pct}%</p>
                    <p className="tab-card-metrics metric-tools">
                      {contentOnlyMode ? 'Tools: --' : `Tools: ${metrics.toolsCompletion}%`}
                    </p>
                    <p className="tab-card-metrics metric-live">
                      {contentOnlyMode ? 'Client: --' : `Live: ${metrics.implementationCompletion}%`}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {selectedTab && (
        <>
          {slug === 'qms' && selectedTab.id === 'tab-1' && <QmsStyleGuide />}

          <div className="group-grid">
            <section className="ref-group-wrap group-wide">
              <div className="ref-section-head">
                <span className="ref-section-label">LiveOps Stage Tracking</span>
                {selectedTabContentMetrics && (
                  <label className="group-content-check">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedTabContentMetrics.items.find((item) => item.id === 'liveops')?.done)}
                      onChange={(event) => {
                        const next = setContentSignalDone(slug, selectedTab.id, 'liveops', event.target.checked)
                        setTabProgress(next)
                      }}
                    />
                    <span>Content</span>
                  </label>
                )}
                <span className="ref-section-check">{hiddenCount > 0 ? `hidden ${hiddenCount}` : 'all visible'}</span>
                <span className="ref-section-line" />
              </div>
              <article className="surface panel-l2 ref-content-card liveops-unified-card">
                <div className="liveops-context-row">
                  <p className="liveops-context-line">
                    Live Snapshot stream: {selectedTab ? `Tab ${selectedTab.label}` : `${sectionContent.tabs.length} tabs`}
                  </p>
                </div>

                {selectedTabContentMetrics && (
                  <>
                    <div className="content-check-controls">
                      {selectedTabContentMetrics.items
                        .filter((item) => item.id === 'header')
                        .map((item) => (
                          <label key={item.id} className="tab-content-signal-chip">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={(event) => {
                                const next = setContentSignalDone(slug, selectedTab.id, item.id, event.target.checked)
                                setTabProgress(next)
                              }}
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      <button type="button" className="tab-content-action" onClick={() => setAllContentSignals(true)}>
                        Check All
                      </button>
                      <button type="button" className="tab-content-action" onClick={() => setAllContentSignals(false)}>
                        Clear All
                      </button>
                    </div>

                  </>
                )}

                <div className="tab-tools-signals stage-progress-grid">
                  <div className="stage-bar-card">
                    <p>Content</p>
                    <div className="stage-bar-track">
                      <span className="stage-bar-fill content" style={{ width: `${selectedTabContentMetrics?.pct ?? 0}%` }} />
                    </div>
                    <strong>
                      {selectedTabContentMetrics ? `${selectedTabContentMetrics.pct}% (${selectedTabContentMetrics.done}/${selectedTabContentMetrics.total})` : '--'}
                    </strong>
                  </div>
                  <div className="stage-bar-card">
                    <p>Tools</p>
                    <div className="stage-bar-track">
                      <span
                        className="stage-bar-fill tools"
                        style={{ width: contentOnlyMode ? '0%' : `${selectedTabStageMetrics?.toolsCompletion ?? 0}%` }}
                      />
                    </div>
                    <strong>{contentOnlyMode ? '--' : `${selectedTabStageMetrics?.toolsCompletion ?? 0}%`}</strong>
                  </div>
                  <div className="stage-bar-card">
                    <p>LiveOps</p>
                    <div className="stage-bar-track">
                      <span
                        className="stage-bar-fill live"
                        style={{ width: contentOnlyMode ? '0%' : `${selectedTabStageMetrics?.implementationCompletion ?? 0}%` }}
                      />
                    </div>
                    <strong>{contentOnlyMode ? '--' : `${selectedTabStageMetrics?.implementationCompletion ?? 0}%`}</strong>
                  </div>
                </div>
              </article>
            </section>

            {visibleContextualGroups.map(({ group, index, decision }) => (
              <section
                key={`${selectedTab.id}-${index}`}
                className={`ref-group-wrap group-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} ${isWideGroup(group.label, index) ? 'group-wide' : ''} ${slug === 'minios' ? 'minios-group' : ''}`}
              >
                <div className="ref-section-head">
                  <span className="ref-section-label">{group.label}</span>
                  {selectedTabContentMetrics && (
                    <label className="group-content-check">
                      <input
                        type="checkbox"
                        checked={Boolean(selectedTabContentMetrics.items.find((item) => item.id === `group-${index}`)?.done)}
                        onChange={(event) => {
                          const next = setContentSignalDone(slug, selectedTab.id, `group-${index}`, event.target.checked)
                          setTabProgress(next)
                        }}
                      />
                      <span>Content</span>
                    </label>
                  )}
                  <span className="ref-section-check">{decision.reason}</span>
                  <span className="ref-section-line" />
                </div>
                <article className="surface panel-l2 ref-content-card editable-card">
                  <div
                    className="editable-html"
                    contentEditable
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={{ __html: group.html }}
                    onBlur={(event) =>
                      applySectionDelta({
                        type: 'group_patch',
                        slug,
                        tabId: selectedTab.id,
                        groupIndex: index,
                        group: { html: event.currentTarget.innerHTML },
                      })
                    }
                  />
                </article>
              </section>
            ))}
          </div>
        </>
      )}
    </section>
  )
}


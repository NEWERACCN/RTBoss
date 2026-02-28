import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SectionTemplateHeader } from '../components/SectionTemplateHeader'
import { evaluateGroupContext } from '../context/contextEngine'
import { applySectionDefaultContext, useContextProfile } from '../context/contextStore'
import { applySectionDelta, useSectionSubscription, useSectionTabSubscription } from '../data/sectionRealtime'
import { getSubjectBySlug } from '../data/subjects'

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
  return /overview|workflow|loop|callout|truth|diagram|chain/i.test(label)
}

export function SubjectPage() {
  const { slug = '', tabId = '' } = useParams()
  const subject = getSubjectBySlug(slug)
  const context = useContextProfile()
  const [showExplain, setShowExplain] = useState(false)
  const sectionContent = useSectionSubscription(slug)
  const selectedTab = useSectionTabSubscription(slug, tabId)

  useEffect(() => {
    if (slug) applySectionDefaultContext(slug)
  }, [slug])

  const contextualGroups = useMemo(() => {
    if (!selectedTab) return []
    return selectedTab.groups
      .map((group, index) => ({
        group,
        index,
        decision: evaluateGroupContext(context, selectedTab, group, index),
      }))
      .sort((a, b) => b.decision.score - a.decision.score || a.index - b.index)
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

  return (
    <section className="content-stack">
      <SectionTemplateHeader
        sectionTag={`${subject.code} Section`}
        title={subject.title}
        subtitle={subject.purpose}
        workstream={subject.workstream}
        category={subject.category}
        complete={subject.complete}
        tabCount={sectionContent.tabs.length}
        groupCount={selectedTab ? selectedTab.groups.length : 0}
      />

      {!selectedTab && (
        <section className="surface panel-l2 wireframe-board">
          <header className="wireframe-header">
            <div className="wireframe-title">
              <h1>{subject.title}</h1>
              <p className="muted">Exact source tabs rendered as drilldown cards.</p>
            </div>
            <div className="wireframe-header-fill" />
            <span className="tab-status in-progress">{sectionContent.tabs.length} Tabs</span>
          </header>

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
              <span className="tab-status">Build</span>
              <span className="tab-status">Ops</span>
            </div>
          </div>

          <div className="tab-card-grid">
            {sectionContent.tabs.map((tab, index) => {
              const parsed = splitTabLabel(tab.label, index)
              return (
                <Link key={tab.id} to={`/subject/${slug}/${tab.id}`} className="tab-card panel-l3 tab-card-link">
                  <p className="tab-card-number">Tab {parsed.number}</p>
                  <p className="tab-card-title">{parsed.text}</p>
                  <span className="tab-link">Open Tab</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {selectedTab && (
        <>
          <section className="surface panel-l2 wireframe-board">
            <header className="wireframe-header">
              <div className="wireframe-title">
                <h1>{selectedTab.label}</h1>
                <p className="muted">Group cards sourced directly from the original section file.</p>
              </div>
              <div className="wireframe-header-fill" />
              <Link className="ghost-link" to={`/subject/${slug}`}>
                Back to Tabs
              </Link>
            </header>
            <div className="wireframe-controls wireframe-controls-subject">
              <p className="context-chip">
                Context: {context.role} / {context.mode} / {context.maturity}
                {hiddenCount > 0 ? ` - hidden ${hiddenCount}` : ' - all visible'}
              </p>
              <button className="context-explain-btn" type="button" onClick={() => setShowExplain((value) => !value)}>
                {showExplain ? 'Hide Context Explain' : 'Show Context Explain'}
              </button>
            </div>
          </section>

          {showExplain && (
            <section className="surface panel-l2 context-drawer">
              <div className="surface-row">
                <h3>Context Explain</h3>
                <span className="surface-meta">Visibility + priority by policy</span>
              </div>
              <div className="context-table">
                {contextualGroups.map(({ group, index, decision }) => (
                  <div key={`cx-${selectedTab.id}-${index}`} className="context-row">
                    <div>
                      <strong>{group.label}</strong>
                      <p className="context-rules">{decision.matchedRules.join(', ') || 'no-rules'}</p>
                    </div>
                    <div className="context-row-meta">
                      <span>{decision.visible ? 'visible' : 'hidden'}</span>
                      <span>score {decision.score}</span>
                      <span>{decision.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="group-grid">
            {visibleContextualGroups.map(({ group, index, decision }) => (
                <section
                  key={`${selectedTab.id}-${index}`}
                  className={`ref-group-wrap ${isWideGroup(group.label, index) ? 'group-wide' : ''} ${slug === 'minios' ? 'minios-group' : ''}`}
                >
                  <div className="ref-section-head">
                    <span className="ref-section-label">{group.label}</span>
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


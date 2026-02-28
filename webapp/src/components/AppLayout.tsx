import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { CONTEXT_PRESETS } from '../context/contextProfiles'
import { applyContextPreset, setContextProfile, useContextPresetId, useContextProfile } from '../context/contextStore'
import { subjects } from '../data/subjects'

const SIDEBAR_GROUPS = [
  {
    label: 'Strategy',
    items: ['strategy', 'architecture', 'infrastructure'],
  },
  {
    label: 'Govern',
    items: ['qms', 'audit-standards', 'execution'],
  },
  {
    label: 'Operate',
    items: ['minios', 'value-engines', 'delivery'],
  },
  {
    label: 'Build',
    items: ['project-management', 'client-projects'],
  },
]

const TOOL_LINKS = [
  { slug: 'build-guides', label: 'Guides' },
  { slug: 'agentic-factory-library', label: 'Agentic Factory Library' },
  { slug: 'change-log', label: 'Change Log' },
]

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(268)
  const [resizing, setResizing] = useState(false)
  const context = useContextProfile()
  const presetId = useContextPresetId()
  const subjectBySlug = new Map(subjects.map((subject) => [subject.slug, subject]))
  const groupedSubjects = SIDEBAR_GROUPS.map((group) => ({
    label: group.label,
    items: group.items
      .map((slug) => subjectBySlug.get(slug))
      .filter((subject): subject is NonNullable<typeof subject> => Boolean(subject)),
  })).filter((group) => group.items.length > 0)

  useEffect(() => {
    const raw = window.localStorage.getItem('realtimeos.sidebarWidth')
    const parsed = raw ? Number(raw) : NaN
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(420, Math.max(248, parsed))
      setSidebarWidth(clamped)
    }
  }, [])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!resizing) return
      const next = Math.min(420, Math.max(248, event.clientX))
      setSidebarWidth(next)
    }
    const onUp = () => {
      if (!resizing) return
      setResizing(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [resizing])

  useEffect(() => {
    window.localStorage.setItem('realtimeos.sidebarWidth', String(sidebarWidth))
  }, [sidebarWidth])

  return (
    <div className="layout-shell" style={{ ['--sidebar-width' as string]: `${sidebarWidth}px` }}>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-zone sidebar-zone-top">
          <div className="brand">
            <p className="brand-kicker">RealTimeOS Platform</p>
            <h2>Command Center</h2>
          </div>
          <nav className="nav-group">
            <p className="nav-group-title">Workspace</p>
            <NavLink
              to="/dashboards"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboards
            </NavLink>
            <NavLink
              to="/subject/reporting-dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Reporting Dashboard
            </NavLink>
          </nav>
        </div>
        <div className="sidebar-zone sidebar-zone-mid">
          <nav className="nav-group">
            {groupedSubjects.map((group) => (
              <section key={group.label} className="workstream-group">
                <p className="workstream-title">{group.label}</p>
                {group.items.map((subject) => (
                  <NavLink
                    key={subject.slug}
                    to={`/subject/${subject.slug}`}
                    className={({ isActive }) => `nav-item nav-item-subtle ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {subject.title}
                  </NavLink>
                ))}
              </section>
            ))}
          </nav>

          <nav className="nav-group">
            <p className="nav-group-title">Tools</p>
            {TOOL_LINKS.map((tool) => (
              <NavLink
                key={tool.slug}
                to={`/subject/${tool.slug}`}
                className={({ isActive }) => `nav-item nav-item-subtle ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {tool.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-zone sidebar-zone-bottom">
          <button type="button" className="nav-item">
            Roadmap
          </button>
          <button type="button" className="nav-item">
            Support
          </button>
        </div>
      </aside>
      <div
        className={`sidebar-resizer ${resizing ? 'active' : ''}`}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onMouseDown={() => setResizing(true)}
      />

      <div className="main-column">
        <header className="topbar">
          <button type="button" className="menu-button" onClick={() => setMenuOpen((value) => !value)}>
            Menu
          </button>
          <div className="topbar-main">
            <p className="topbar-label">RealTimeOS Workspace</p>
            <strong>Command Center</strong>
          </div>
          <NavLink to="/" className="topbar-home-btn">
            Home
          </NavLink>
          <div className="topbar-actions">
            <select
              className="topbar-context-select"
              value={presetId}
              onChange={(event) => {
                const value = event.target.value as keyof typeof CONTEXT_PRESETS | 'custom' | 'section-default'
                if (value in CONTEXT_PRESETS) applyContextPreset(value as keyof typeof CONTEXT_PRESETS)
              }}
            >
              <option value="custom">Custom</option>
              <option value="section-default">Section Default</option>
              <option value="executive-review">Executive Review</option>
              <option value="ops-daily">Ops Daily</option>
              <option value="builder-mode">Builder Mode</option>
              <option value="audit-readiness">Audit Readiness</option>
            </select>
            <select
              className="topbar-context-select"
              value={context.role}
              onChange={(event) => setContextProfile({ role: event.target.value as typeof context.role })}
            >
              <option value="executive">Executive</option>
              <option value="operator">Operator</option>
              <option value="builder">Builder</option>
            </select>
            <select
              className="topbar-context-select"
              value={context.mode}
              onChange={(event) => setContextProfile({ mode: event.target.value as typeof context.mode })}
            >
              <option value="overview">Overview</option>
              <option value="operate">Operate</option>
              <option value="build">Build</option>
            </select>
            <select
              className="topbar-context-select"
              value={context.maturity}
              onChange={(event) => setContextProfile({ maturity: event.target.value as typeof context.maturity })}
            >
              <option value="foundation">Foundation</option>
              <option value="scaling">Scaling</option>
              <option value="optimized">Optimized</option>
            </select>
            <input className="topbar-search" placeholder="Search sections, tabs, or ask AI..." />
            <button type="button" className="topbar-action-btn">
              + New
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

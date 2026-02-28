import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { CONTEXT_PRESETS } from '../context/contextProfiles'
import { applyContextPreset, setContextProfile, useContextPresetId, useContextProfile } from '../context/contextStore'
import { subjects } from '../data/subjects'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const context = useContextProfile()
  const presetId = useContextPresetId()

  return (
    <div className="layout-shell">
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
          </nav>
        </div>
        <div className="sidebar-zone sidebar-zone-mid">
          <nav className="nav-group">
            <p className="nav-group-title">Sections</p>
            {subjects.map((subject) => (
              <NavLink
                key={subject.slug}
                to={`/subject/${subject.slug}`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {subject.title}
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

      <div className="main-column">
        <header className="topbar">
          <button type="button" className="menu-button" onClick={() => setMenuOpen((value) => !value)}>
            Menu
          </button>
          <div className="topbar-main">
            <p className="topbar-label">RealTimeOS Workspace</p>
            <strong>Command Center</strong>
          </div>
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

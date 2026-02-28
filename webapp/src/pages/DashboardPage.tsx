import { Link } from 'react-router-dom'

const metrics = [
  { label: 'Subject Areas', value: '8', detail: 'Primary playbook streams mapped in UI.' },
  { label: 'Card Tabs', value: '24', detail: 'Drillable cards available across subjects.' },
  { label: 'Dashboard Links', value: '4', detail: 'Analytics launch points ready to wire.' },
]

export function DashboardPage() {
  return (
    <section className="content-stack">
      <section className="surface panel-l2 wireframe-board">
        <header className="wireframe-header">
          <div className="wireframe-title">
            <h1>Jobs</h1>
            <p className="muted">An overview of active and past jobs with progress and status.</p>
          </div>
          <div className="wireframe-header-fill" />
          <button type="button" className="topbar-action-btn">
            + New Job
          </button>
        </header>

        <div className="wireframe-kpi">
          {metrics.map((item) => (
            <article key={item.label} className="metric-card panel-l3">
              <p className="metric-label">{item.label}</p>
              <p className="metric-value">{item.value}</p>
              <p className="metric-detail">{item.detail}</p>
            </article>
          ))}
          <article className="metric-card panel-l3">
            <p className="metric-label">Failed</p>
            <p className="metric-value">3</p>
            <p className="metric-detail">2 paused, 1 error.</p>
          </article>
        </div>

        <div className="wireframe-controls">
          <input className="topbar-search wireframe-search" placeholder="Search jobs..." />
          <button type="button" className="ghost-link">
            Filter
          </button>
          <button type="button" className="ghost-link">
            Sort
          </button>
          <div className="wireframe-tabs">
            <span className="tab-status in-progress">All</span>
            <span className="tab-status">Running</span>
            <span className="tab-status">Successful</span>
            <span className="tab-status not-started">Failed</span>
          </div>
        </div>

        <div className="wireframe-table panel-l3">
          <div className="wireframe-row wireframe-head">
            <span>Job Name</span>
            <span>Description</span>
            <span>Progress</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          <div className="wireframe-row">
            <span>Weekly Export</span>
            <span>Export all CAD drawings to PDF format</span>
            <span>12/20 files - 60%</span>
            <span className="tab-status in-progress">Running</span>
            <span>Live</span>
          </div>
          <div className="wireframe-row">
            <span>Model Backup</span>
            <span>Backup all active models to archive drive</span>
            <span>50/50 files - 100%</span>
            <span className="tab-status complete">Success</span>
            <span>Feb 19</span>
          </div>
          <div className="wireframe-row">
            <span>DXF Conversion</span>
            <span>Convert DWG files to DXF for delivery</span>
            <span>18/35 files - 51%</span>
            <span className="tab-status in-progress">Running</span>
            <span>Live</span>
          </div>
        </div>
      </section>

      <div className="tab-card-grid">
        <Link to="/subject/strategy/tab-1" className="tab-card panel-l3 tab-card-link">
          <p className="tab-card-title">01 Strategy</p>
          <p className="tab-card-summary">Objectives, governance, roadmap.</p>
          <span className="tab-link">Open Subject</span>
        </Link>
        <Link to="/subject/architecture/tab-1" className="tab-card panel-l3 tab-card-link">
          <p className="tab-card-title">02 Architecture</p>
          <p className="tab-card-summary">Reference model, capabilities, integration.</p>
          <span className="tab-link">Open Subject</span>
        </Link>
        <Link to="/subject/execution/tab-1" className="tab-card panel-l3 tab-card-link">
          <p className="tab-card-title">08 Execution</p>
          <p className="tab-card-summary">Program state, risks, action tracking.</p>
          <span className="tab-link">Open Subject</span>
        </Link>
      </div>
    </section>
  )
}

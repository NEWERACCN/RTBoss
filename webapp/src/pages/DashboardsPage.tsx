const dashboardCards = [
  { title: 'Executive Snapshot', detail: 'High-level readiness, schedule confidence, and top risks.' },
  { title: 'Quality Dashboard', detail: 'QMS controls, audit evidence status, and non-conformance trends.' },
  { title: 'Delivery Health', detail: 'Throughput, blocker aging, and iteration predictability.' },
  { title: 'Project Portfolio', detail: 'Cross-project status with dependency heatmap and owners.' },
]

export function DashboardsPage() {
  return (
    <section className="content-stack">
      <section className="surface panel-l2 wireframe-board">
        <header className="wireframe-header">
          <div className="wireframe-title">
            <h1>Dashboards</h1>
            <p className="muted">Launch points for KPI reports, BI views, and telemetry drilldowns.</p>
          </div>
          <div className="wireframe-header-fill" />
          <button type="button" className="topbar-action-btn">
            + New Dashboard
          </button>
        </header>

        <div className="wireframe-controls">
          <input className="topbar-search wireframe-search" placeholder="Search dashboards..." />
          <button type="button" className="ghost-link">
            Filter
          </button>
          <button type="button" className="ghost-link">
            Sort
          </button>
          <div className="wireframe-tabs">
            <span className="tab-status in-progress">All</span>
            <span className="tab-status">Executive</span>
            <span className="tab-status">Operations</span>
            <span className="tab-status">Quality</span>
          </div>
        </div>

        <div className="tab-card-grid">
          {dashboardCards.map((card) => (
            <article key={card.title} className="tab-card panel-l3">
              <p className="tab-card-title">{card.title}</p>
              <p className="tab-card-summary">{card.detail}</p>
              <a className="tab-link" href="#">
                Open Dashboard
              </a>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

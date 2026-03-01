import { Link } from 'react-router-dom'

const telemetryTiles = [
  { label: 'Workstreams Active', value: '4', note: 'Strategy, Govern, Operate, Build', tone: 'cyan' },
  { label: 'Sections Online', value: '15/15', note: 'All core sections reachable', tone: 'green' },
  { label: 'Tab Cards', value: '124', note: 'Drilldown cards indexed', tone: 'blue' },
  { label: 'Editable Groups', value: '412', note: 'Source-linked content cards', tone: 'violet' },
  { label: 'Context Mode', value: 'Live', note: 'Adaptive profile active', tone: 'cyan' },
  { label: 'Build Readiness', value: '92%', note: 'Parity sweep near complete', tone: 'amber' },
  { label: 'Data Latency', value: '120ms', note: 'Subscription simulation', tone: 'green' },
  { label: 'Quality Signals', value: 'Stable', note: 'No blocking incidents', tone: 'blue' },
]

const liveEvents = [
  { stream: 'Strategy Core', event: 'Tab card map refreshed', status: 'Live' },
  { stream: 'Mini-OS', event: 'Content cards synchronized', status: 'Live' },
  { stream: 'QMS', event: 'Brand standard loaded', status: 'Live' },
  { stream: 'Execution', event: 'Delivery indicators recalculated', status: 'Live' },
]

const quickLinks = [
  { to: '/subject/strategy/tab-1', title: 'Strategy', summary: 'Objectives, governance, and flywheel model.' },
  { to: '/subject/architecture/tab-1', title: 'OS Framework', summary: 'Operating model and core architecture references.' },
  { to: '/subject/execution/tab-1', title: 'Continuous Delivery', summary: 'Run-state controls, cadence, and standards.' },
]

export function DashboardPage() {
  return (
    <section className="content-stack mission-control-screen">
      <section className="surface panel-l2 mission-shell">
        <header className="mission-topbar">
          <div>
            <p className="mission-kicker">LIVEOPSOS // MISSION CONTROL</p>
            <h1>LiveOpsOS Mission Control</h1>
            <p className="muted">Real-time command surface for LiveOpsOS system state, structure, and execution flow.</p>
          </div>
          <div className="mission-actions">
            <span className="mission-chip">Live Stream: Connected</span>
            <button type="button" className="topbar-action-btn">
              + New Link
            </button>
          </div>
        </header>

        <div className="mission-tile-grid">
          {telemetryTiles.map((tile) => (
            <article key={tile.label} className={`mission-tile mission-${tile.tone}`}>
              <p className="mission-tile-label">{tile.label}</p>
              <p className="mission-tile-value">{tile.value}</p>
              <p className="mission-tile-note">{tile.note}</p>
            </article>
          ))}
        </div>

        <div className="mission-panel-grid">
          <section className="mission-panel">
            <div className="mission-panel-head">
              <h3>System Throughput</h3>
              <span className="mission-chip">delta stream</span>
            </div>
            <div className="mission-chart-grid" />
            <div className="mission-bars" aria-hidden>
              <span style={{ height: '36%' }} />
              <span style={{ height: '58%' }} />
              <span style={{ height: '64%' }} />
              <span style={{ height: '49%' }} />
              <span style={{ height: '70%' }} />
              <span style={{ height: '76%' }} />
              <span style={{ height: '68%' }} />
              <span style={{ height: '82%' }} />
            </div>
          </section>

          <section className="mission-panel">
            <div className="mission-panel-head">
              <h3>Live Rewards</h3>
              <span className="mission-chip">adaptive context</span>
            </div>
            <div className="mission-chart-grid" />
            <div className="mission-lines" aria-hidden>
              <span className="line-green" />
              <span className="line-cyan" />
              <span className="line-amber" />
            </div>
          </section>
        </div>

        <section className="mission-stream panel-l3">
          <div className="mission-panel-head">
            <h3>Live Event Stream</h3>
            <span className="mission-chip">subscribe then render</span>
          </div>
          <div className="mission-stream-grid">
            <div className="mission-stream-row mission-stream-head">
              <span>Stream</span>
              <span>Event</span>
              <span>Status</span>
            </div>
            {liveEvents.map((entry) => (
              <div key={`${entry.stream}-${entry.event}`} className="mission-stream-row">
                <span>{entry.stream}</span>
                <span>{entry.event}</span>
                <span className="mission-live">{entry.status}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <div className="tab-card-grid">
        {quickLinks.map((card) => (
          <Link key={card.to} to={card.to} className="tab-card panel-l3 tab-card-link">
            <p className="tab-card-title">{card.title}</p>
            <p className="tab-card-summary">{card.summary}</p>
            <span className="tab-link">Open Subject</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

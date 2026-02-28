type SectionTemplateHeaderProps = {
  sectionTag: string
  title: string
  subtitle: string
  workstream: string
  category: string
  complete: boolean
  tabCount: number
  groupCount: number
}

export function SectionTemplateHeader({
  sectionTag,
  title,
  subtitle,
  workstream,
  category,
  complete,
  tabCount,
  groupCount,
}: SectionTemplateHeaderProps) {
  return (
    <>
      <div className="hero-panel panel-l1">
        <p className="pill">{sectionTag}</p>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>

      <section className="surface panel-l2 section-meta-bar">
        <div className="meta-chip">
          <span className="meta-icon">#</span>
          <span className="meta-label">Workstream</span>
          <strong>{workstream}</strong>
        </div>
        <div className="meta-chip">
          <span className="meta-icon">::</span>
          <span className="meta-label">Category</span>
          <strong>{category}</strong>
        </div>
        <div className={`meta-chip ${complete ? 'ok' : 'pending'}`}>
          <span className="meta-icon">{complete ? 'OK' : '..'}</span>
          <span className="meta-label">Status</span>
          <strong>{complete ? 'Complete' : 'In Progress'}</strong>
        </div>
      </section>

      <section className="surface panel-l2 section-tabs-bar">
        <div className="counter-chip">
          <span className="meta-icon">[]</span>
          Tabs <strong>{tabCount}</strong>
        </div>
        <div className="counter-chip">
          <span className="meta-icon">{'{ }'}</span>
          Groups <strong>{groupCount}</strong>
        </div>
      </section>
    </>
  )
}

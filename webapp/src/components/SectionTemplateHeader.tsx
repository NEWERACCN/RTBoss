type SectionTemplateHeaderProps = {
  sectionTag: string
  title: string
  subtitle: string
  workstream: string
  category: string
  complete: boolean
  tabCount: number
  groupCount: number
  showHero?: boolean
  showMetaBars?: boolean
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
  showHero = true,
  showMetaBars = true,
}: SectionTemplateHeaderProps) {
  return (
    <>
      {showHero && (
        <div className="hero-panel panel-l1">
          <p className="pill">{sectionTag}</p>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
        </div>
      )}

      {showMetaBars && (
        <>
          <section className="surface panel-l2 section-meta-bar">
            <div className={`meta-chip meta-chip-status ${complete ? 'ok' : 'pending'}`}>
              <strong>{complete ? 'Live – Complete' : 'Live – In Progress'}</strong>
            </div>
            <div className="meta-chip meta-chip-secondary">
              <strong>{category}</strong>
            </div>
            <div className="meta-chip meta-chip-secondary">
              <strong>{workstream}</strong>
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
      )}
    </>
  )
}

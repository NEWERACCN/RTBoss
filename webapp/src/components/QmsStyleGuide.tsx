const COLOR_TOKENS = [
  { name: 'Midnight Base', hex: '#070f1e', usage: 'Primary application background' },
  { name: 'Surface L1', hex: '#10233a', usage: 'Main cards and control surfaces' },
  { name: 'Surface L2', hex: '#182844', usage: 'Secondary cards and grouped blocks' },
  { name: 'Signal Cyan', hex: '#55b6ff', usage: 'Navigation and informational highlights' },
  { name: 'Outcome Green', hex: '#47d17e', usage: 'Success states and primary emphasis' },
  { name: 'Alert Red', hex: '#ff6f7c', usage: 'Errors and critical exceptions' },
]

const TYPE_TOKENS = [
  { role: 'Display Headings', value: 'Space Grotesk, 700-800, tight tracking' },
  { role: 'UI Body', value: 'Manrope, 400-600, high readability' },
  { role: 'System Labels', value: 'Uppercase micro labels, 0.64rem-0.74rem' },
]

const RULES = [
  'One accent intent per component: info OR success OR warning, never mixed.',
  'Cards stay shallow and legible: avoid heavy gradients inside content blocks.',
  'Section labels are short and consistent: Workstream, Category, Status.',
  'All live snapshot rows keep a fixed rhythm: title row, control row, content row.',
]

export function QmsStyleGuide() {
  return (
    <section className="surface panel-l2 qms-style-guide">
      <div className="surface-row">
        <h3>Visual Design Guide</h3>
        <span className="surface-meta">Brand & Identity - Tab 01</span>
      </div>

      <div className="qms-guide-grid">
        <article className="qms-guide-card">
          <p className="qms-guide-kicker">Color System</p>
          <div className="qms-swatch-grid">
            {COLOR_TOKENS.map((token) => (
              <div key={token.name} className="qms-swatch-item">
                <span className="qms-swatch-dot" style={{ backgroundColor: token.hex }} />
                <div>
                  <p className="qms-token-name">{token.name}</p>
                  <p className="qms-token-sub">
                    {token.hex} - {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="qms-guide-card">
          <p className="qms-guide-kicker">Typography System</p>
          <div className="qms-token-list">
            {TYPE_TOKENS.map((token) => (
              <div key={token.role} className="qms-token-row">
                <span className="qms-token-role">{token.role}</span>
                <span className="qms-token-sub">{token.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="qms-guide-card qms-guide-card-wide">
          <p className="qms-guide-kicker">Layout And Interaction Rules</p>
          <ul className="qms-rule-list">
            {RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}



# LiveOpsOS Design Guide

## Brand System
- Platform name: `LiveOpsOS`
- Operating model: `LiveOps`
- Primary UI surface: `Mission Control`
- Snapshot surface label: `Live Snapshot`

## Product Naming Rules
- Use `LiveOpsOS` everywhere for platform naming.
- Use `Mission Control` for the main command surface.
- Replace user-facing `Dashboard` with `Live Snapshot`.
- Keep legacy route paths stable where required (example: `/dashboards`).

## Visual Direction
- Dark command-center surface with high-contrast data hierarchy.
- Compact operator-friendly spacing and structured card rhythm.
- Subtle glow and border contrast, not heavy gradients.

## Core Tokens
```css
:root {
  --bg-0: #070f1e;
  --bg-1: #10233a;
  --bg-2: #182844;

  --line-0: #27466f;
  --line-1: #3b5f93;

  --text-0: #eef5ff;
  --text-1: #b6c8e8;
  --text-2: #7f96bf;

  --accent-cyan: #55b6ff;
  --accent-green: #47d17e;
  --accent-amber: #f4c15d;
  --accent-red: #ff6f7c;
}
```

## Typography
- Heading: `Space Grotesk` (700-800)
- Body/UI: `Manrope` (400-600)
- Micro labels: uppercase, tight tracking, `0.64rem-0.74rem`

## Layout Rules
- Base spacing unit: `8px`
- Card padding: `16px-20px`
- Group gap: `16px-24px`
- Section separation: `28px-36px`
- Avoid wall-of-cards layouts; preserve breathing room between groups.

## Component Standards
### Sidebar
- Keep grouped navigation model: Strategy, Govern, Operate, Build, Tools.
- Active nav state uses one accent cue only (border/rail), not multiple.

### Top Bar
- Keep context selectors in one row.
- Keep Home action visible.

### Section Header
- One primary header block per section.
- Metadata row includes: Workstream, Category, Status.
- Counter chips include: Section, Tabs, Groups.

### Tab Cards
- Each tab card shows tab id, title, and short glance summary.
- Primary action: `Open Tab`.

### Group Cards
- One source group equals one editable card.
- Preserve source fidelity (no summarization unless requested).

## Accessibility
- Maintain WCAG AA contrast.
- Visible focus state on interactive controls.
- Never rely on color alone for meaning.

## Implementation Checklist
1. Freeze naming across labels (`LiveOpsOS`, `Mission Control`, `Live Snapshot`).
2. Standardize section header and metadata layout globally.
3. Keep source-content cards editable and parity-accurate.
4. Run copy QA for deprecated terms before each release.

## Where It Appears In App
- `QMS -> Tab 01 (Brand & Identity)` renders the in-app visual guide component.
- This markdown file is the durable reference for design decisions.

# RealTimeOS x New Era IT
## Design + Brand Guide (v1)

## 1) Brand Position
- Brand: `New Era IT`
- Platform: `RealTimeOS`
- Promise: `Shaping the future of work`
- Tone: `command center`, `high trust`, `operational precision`, `human-first + AI-native`

## 2) Visual Direction
- Base style: deep-black control surface with electric accents.
- Feel: premium enterprise ops console, not slide deck, not generic SaaS.
- Density: information-rich cards with strict spacing rhythm.
- Shape language: rounded-rectangle panels (`10px-14px` radius), thin borders, subtle glow.

## 3) Color System
Use these as canonical tokens.

```css
:root {
  --bg-0: #05070d;        /* app background */
  --bg-1: #0a1020;        /* primary panel */
  --bg-2: #101a31;        /* raised card */
  --bg-3: #14203a;        /* hover/active card */

  --text-0: #f5f8ff;      /* primary text */
  --text-1: #b7c4e6;      /* secondary text */
  --text-2: #7d8fb6;      /* muted labels */

  --line-0: #223150;      /* default border */
  --line-1: #2f4674;      /* focused border */

  --brand-cyan: #22d3ee;  /* New Era accent */
  --brand-blue: #2f6bff;  /* platform action */
  --brand-green: #23d18b; /* success/live */
  --brand-amber: #f4b43a; /* warning */
  --brand-red: #ff6b6b;   /* error */
  --brand-violet: #8f7bff;/* optional secondary accent */
}
```

Rules:
- Cyan + blue are primary brand accents.
- Green only for positive state/active flow.
- Red only for destructive/critical.
- Avoid purple-dominant screens.

## 4) Typography
- Display/Headings: `Space Grotesk` (already in app).
- Body/UI: `Manrope` (already in app).
- Numeric/status data: optionally monospace (`JetBrains Mono`) for counters and IDs.

Type scale:
- H1: `48/52`, semibold.
- H2: `32/38`, semibold.
- H3: `22/30`, semibold.
- Body: `16/26`, regular.
- Meta labels: `12/16`, medium, uppercase + tracking.

## 5) Spacing + Layout
- Base unit: `8px`.
- Panel padding: `20px`.
- Card gap in groups: `16px-20px`.
- Section-to-section gap: `28px-36px`.
- Max content width: fluid, but keep readable columns for long text (`72ch` max in prose cards).

## 6) Surfaces and Elevation
- Every card has: `1px` border + subtle inner gradient.
- Use restrained shadow, not heavy blur.
- Hover: border brightens, background lifts one step.
- Active tab/card: left accent rail or bottom underline, never both.

## 7) Component Rules
### Sidebar
- Keep current structure.
- Remove numeric clutter in labels (already done).
- Active item: cyan rail + brighter text.

### Topbar
- Keep as fixed command layer.
- Include workspace mode/status chip set.

### Tab Cards
- Each tab card contains:
  - tab id (small label),
  - title,
  - short summary,
  - glance metadata row (`groups`, `status`, `owner` placeholder).
- Keep "Open Detail" as drilldown action.

### Group Cards
- Exact source content preserved.
- Each source group = one editable card.
- Clear spacing between cards for editability.

### Callouts
- Universal truth / key principles use dedicated callout blocks.
- Callout styling: stronger border + icon + subtle tint background.

## 8) Motion
- Keep minimal and meaningful:
  - page enter: `180ms` fade + `8px` rise.
  - card hover: `120ms` border/background lift.
  - no continuous decorative animation in dense work pages.

## 9) Iconography
- Use consistent thin-line icon set (e.g. Lucide).
- One icon style only across app.
- Use icons for:
  - status,
  - section identity,
  - callouts,
  - nav affordances.

## 10) Logo Usage
- Primary lockup: New Era IT logo on dark background.
- Clear space: at least logo-height x `0.5` around lockup.
- Do not add glows/gradients directly on logo mark.
- Use cyan/blue accents around logo, not inside logo unless source asset provides it.

## 11) Accessibility
- Minimum contrast: WCAG AA.
- Never rely on color alone for state.
- Focus ring: visible on all interactive elements.

## 12) Implementation Sequence
1. Freeze brand tokens in `src/index.css` (`:root` variables).
2. Update core shells: background, sidebar, topbar, cards.
3. Standardize tab card + group card templates.
4. Apply callout and status chip system.
5. QA every section for spacing, parity, and readability.

---

## Decision Log (v1)
- Direction approved: dark command-center UI with cyan/blue New Era accents.
- Priority: parity first, then visual polish in controlled passes.

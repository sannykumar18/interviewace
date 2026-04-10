# AI Interview Practice System — Design Brief

## Tone & Differentiation
Professional, intentional, placement-focused. Indigo primary signals trust and productivity. Clean white cards on soft grays emphasize clarity and information hierarchy. Zero decoration—every color and shadow serves function. Dark mode optimized for extended study sessions.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Purpose |
| --- | --- | --- | --- |
| Primary (Indigo) | 0.55 0.18 265 | 0.65 0.18 265 | CTAs, active states, primary navigation |
| Accent (Gold) | 0.65 0.19 40 | 0.72 0.19 40 | Highlights, progress indicators, timer visual |
| Success (Teal) | 0.68 0.19 122 | 0.78 0.19 122 | Positive feedback, correct answers |
| Warning (Red) | 0.55 0.22 25 | 0.65 0.19 22 | Errors, incorrect answers, destructive actions |
| Chart Blue | 0.58 0.19 254 | 0.68 0.19 254 | Performance chart series |
| Background | 0.97 0.01 0 | 0.12 0.01 0 | Page background, minimal visual texture |
| Card | 0.99 0 0 | 0.16 0.01 0 | Elevated content surfaces with subtle shadow |
| Border | 0.92 0.01 0 | 0.25 0.01 0 | Dividers, form inputs |
| Muted Foreground | 0.52 0.01 0 | 0.62 0.01 0 | Secondary text, metadata, disabled states |

## Typography

| Scale | Font | Weight | Usage |
| --- | --- | --- | --- |
| Display | Space Grotesk | 600–700 | Page headings, stat labels, category badges |
| Body | Plus Jakarta Sans | 400–600 | Questions, answers, feedback, UI copy |
| Mono | JetBrains Mono | 400–600 | Code snippets, timer display |

## Structural Zones

| Zone | Surface | Border | Elevation | Purpose |
| --- | --- | --- | --- | --- |
| Header | `bg-card` | `border-b border-border` | Subtle card shadow | Navigation, profile, breadcrumb |
| Main Content | `bg-background` | None | Flat | Question + answer area |
| Stat Cards | `bg-card` | `border border-border` | `shadow-card` | KPIs: accuracy, streak, completed |
| NLP Feedback | `bg-card` | `border border-border` | `shadow-elevated` | Score breakdown: keyword, grammar, confidence, sentiment |
| Footer | `bg-muted/20` | `border-t border-border` | Flat | Session timer, navigation |

## Component Patterns

**Stat Card:** Icon + large number + label. Indigo primary text for heading, muted for label. Subtle card elevation emphasizes significance.

**Category Badge:** Text badge with category-specific background. Python=yellow-100/800, ML=purple-100/800, DS=cyan-100/800, AI=teal-100/800, DB=orange-100/800. Dark mode inverts to -950/-200.

**Timer Visual:** SVG stroke circle with gold accent. Animated `countdown` keyframe driven by remaining seconds. Pulse ring on expiry.

**Answer Feedback Card:** 4 vertical metrics (keyword match %, grammar score, confidence %, sentiment polarity) with color-coded bars or icons. Labels below each metric in body font.

**Progress Bar:** Thin indigo bar for accuracy %, question completion %, streak progress. No rounded caps—sharp, minimal aesthetic.

**Text Input:** `border border-border bg-background` with focus ring in primary. Placeholder in muted-foreground. Font: body.

## Spacing & Rhythm

Grid: `8px` base unit. Padding: `16px` (2x), `24px` (3x), `32px` (4x). Gap between cards: `16px`. Stat cards horizontal stack on `lg:`, vertical on `sm:`. Dense information grid; no whitespace excess.

## Motion & Animation

**Smooth Transition:** All interactive elements use `transition-smooth` class (0.3s cubic-bezier). Buttons, hovers, focus states.

**Timer Countdown:** SVG stroke animation over 30 seconds. Pulse ring (1.5s loop) at 5-second warning.

**Question Transition:** Fade + slide—new question appears with `fade-in-up` (100ms).

**Feedback Score Animation:** Metric bars animate from 0 to final value (300ms stagger).

## Constraints & Guardrails

- No gradients, no blur, no glassmorphism—clarity is premium.
- Category colors must maintain 4.5:1 contrast in both modes (verified above).
- All interactive elements >44px touch target.
- Form inputs must have visible focus ring in primary color.
- Dark mode text must be ≥0.90 L in OKLCH for accessibility.
- Max line length 65 chars on questions for readability.

## Signature Detail

**Gold Accent Timer Ring:** The 30-second countdown visual is the app's signature. Animated stroke circle in gold/accent color on indigo card background creates rhythm and urgency. Paired with mono font for precise time display. This detail signals "high-stakes practice" without distraction.

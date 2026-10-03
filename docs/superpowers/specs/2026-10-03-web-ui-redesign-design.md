# Web UI Redesign — Dark Green Immersive

Date: 2026-10-03
Scope: `apps/web` only (Next.js 16, Tailwind 4). Mobile app, API, data logic and routes are unchanged.

## Goal

Full redesign of the organizer web dashboard using the user's palette, in a dark-green immersive style.
"Full" means: color tokens, typography, shared app shell, reusable UI components, restyled pages,
empty/loading/error states, responsive layouts, and accessibility.

## Palette

Brand colors (from the user's swatch):

| Role | Hex | Use |
|---|---|---|
| Orange | `#ff4a01` | Primary buttons |
| Amber | `#ff8b00` | Primary hover, accents |
| Forest green | `#396c03` | Nav, selected states, card accents (too mid-tone for backgrounds) |
| Lime | `#d8d92e` | Success / "going" states |
| Yellow | `#ffd900` | Badges, highlights, focus rings, "maybe" status |

Derived neutrals (dark green family):

| Token | Hex | Use |
|---|---|---|
| canvas | `#0b1a05` | Page background |
| surface | `#12260a` | Cards |
| raised | `#1a3510` | Hovered / raised surfaces |
| border | slightly lighter green than raised | Card and input borders |
| ink | warm off-white | Body text |
| muted | sage | Secondary text |

Primary buttons use dark text on orange for contrast. All text/background pairs must meet WCAG AA.
The UI is dark-only; the `prefers-color-scheme` block in `globals.css` is removed.

## Implementation approach

Tailwind 4 `@theme` tokens in `globals.css` plus a small in-repo component set in `src/components/ui/`.
No new dependencies other than fonts via `next/font`. (shadcn/ui and CSS modules were considered and rejected:
the app is small and already on Tailwind.)

Tokens are exposed as utility classes (`bg-canvas`, `bg-surface`, `text-ink`, `bg-brand`, `text-sun`, `ring-focus`, ...).
Hex values are kept in one place so the mobile app can reuse them later.

## Typography

`next/font`: a bold display face for headings (Bricolage Grotesque or Outfit) and Geist for body.
Remove the `Arial` override on `body`.

## App shell (`layout.tsx`)

- Sticky top bar: logo mark, "Clubs" link, `CurrentUserBadge`. Collapses to logo + badge on mobile.
- Background: subtle court-line pattern or green gradient.
- Footer.

## Shared components (`src/components/ui/`)

- `Button` — primary (orange), secondary (outline), ghost.
- `Card` — surface, border, hover lift.
- `Badge` — yellow, lime, neutral tones.
- `Input`, `Textarea`, `Select` — dark fields, yellow focus ring.
- `PageHeader` — title, subtitle, actions.
- `EmptyState`, `Notice`, `Skeleton` — replace bare error/empty text; add loading states.

Existing `CurrentUserBadge`, `RsvpPanel`, `MatchesPanel` keep their logic and are restyled with these primitives.

## Pages

- Home: hero headline, orange CTA, short feature row.
- Clubs list: card grid (name, description, join-code badge) instead of divider list.
- Club detail and events: event cards with date, location, skill-range badges; RSVP status lime = going, yellow = maybe.
- New club / new event forms: centered card, labelled fields, inline validation text.
- Matches panel: score entry and results in surface cards.

## Responsive and accessibility

- Mobile-first; grids 1 → 2 → 3 columns; tap targets >= 44px; no horizontal scroll at 360px.
- AA contrast on all text pairs; visible focus on every interactive element.
- Respect `prefers-reduced-motion` for hover/transition effects.

## Out of scope

API, data fetching logic, routes, mobile app, new features, light theme.

## Verification

- `tsc --noEmit` and `next build` pass.
- Run `next dev`; check every page in a browser at desktop and 375px widths.
- Spot-check contrast of the token pairs.

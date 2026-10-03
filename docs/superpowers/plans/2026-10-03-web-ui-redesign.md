# Web UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the whole `apps/web` organizer dashboard with the user's orange/amber/forest-green/lime/yellow palette in a dark-green immersive look.

**Architecture:** Palette and fonts become Tailwind 4 `@theme` tokens in `globals.css`. A small set of presentational components in `src/components/ui/` is built first; every page and the three existing components are then rewritten on top of them. No data, API, or routing logic changes.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, `next/font/google` (Outfit + Geist), TypeScript.

Spec: `docs/superpowers/specs/2026-10-03-web-ui-redesign-design.md`

## Global Constraints

- Scope is `apps/web` only. Do not touch `apps/api`, `apps/mobile`, `src/lib/*` logic (except the one optional-field type addition in Task 4), or routes.
- Dark-only UI: remove the `prefers-color-scheme` block; no light theme.
- Palette hex values (verbatim from spec): orange `#ff4a01`, amber `#ff8b00`, forest green `#396c03`, lime `#d8d92e`, yellow `#ffd900`.
- Derived neutrals: canvas `#0b1a05`, surface `#12260a`, raised `#1a3510`; plus a border green, warm off-white ink, sage muted.
- Primary buttons: dark text on orange; hover amber.
- All text/background pairs meet WCAG AA; visible focus (yellow) on every interactive element; respect `prefers-reduced-motion`.
- Mobile-first: grids 1 → 2 → 3 columns, tap targets >= 44px, no horizontal scroll at 360px.
- Fonts via `next/font` only (Outfit for headings, Geist for body); remove the `Arial` override.
- No new npm dependencies.
- The web app has no test framework. Verification per task is `npx tsc --noEmit` (run in `apps/web`) plus visual check with `npm run dev:web`; final task also runs `npm run lint` and `npm run build`. Do not add a test framework.

---

### Task 1: Design tokens, fonts, and app shell

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/components/SiteHeader.tsx`
- Create: `apps/web/src/components/SiteFooter.tsx`

**Interfaces:**
- Produces Tailwind utilities used by every later task: colors `canvas`, `surface`, `raised`, `line`, `ink`, `muted`, `brand` (orange), `brand-hover` (amber), `leaf` (forest green), `lime`, `sun` (yellow), `danger`, `focus`; fonts `font-display`, `font-sans`.
- Produces `SiteHeader` (server component, default export, no props) and `SiteFooter` (default export, no props).

- [ ] **Step 1: Replace `globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-canvas: #0b1a05;
  --color-surface: #12260a;
  --color-raised: #1a3510;
  --color-line: #2c4a1d;
  --color-ink: #f4f1e6;
  --color-muted: #a9bd96;
  --color-brand: #ff4a01;
  --color-brand-hover: #ff8b00;
  --color-leaf: #396c03;
  --color-lime: #d8d92e;
  --color-sun: #ffd900;
  --color-danger: #ff8a7a;
  --color-focus: #ffd900;

  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
}

html {
  color-scheme: dark;
}

body {
  background-color: var(--color-canvas);
  background-image:
    radial-gradient(60rem 28rem at 50% -8%, rgb(57 108 3 / 0.5), transparent 70%),
    repeating-linear-gradient(90deg, transparent 0 79px, rgb(244 241 230 / 0.035) 79px 80px);
  background-attachment: fixed;
  color: var(--color-ink);
  font-family: var(--font-sans);
}

:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
}
```

- [ ] **Step 2: Create `SiteHeader.tsx`**

```tsx
import Link from 'next/link';
import CurrentUserBadge from './CurrentUserBadge';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-brand text-base"
            >
              🏓
            </span>
            <span>
              Dink<span className="text-sun">Zone</span>
            </span>
          </Link>
          <nav aria-label="Main" className="hidden sm:block">
            <Link
              href="/clubs"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-leaf/40 hover:text-ink"
            >
              Clubs
            </Link>
          </nav>
        </div>
        <CurrentUserBadge />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `SiteFooter.tsx`**

```tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-6 text-center text-xs text-muted">
      DinkZone organizer dashboard
    </footer>
  );
}
```

- [ ] **Step 4: Replace `layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Geist, Outfit } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['600', '700', '800'] });

export const metadata: Metadata = {
  title: 'DinkZone — Pickleball Club Organizer',
  description: 'Organizer web dashboard for the pickleball club app.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geist.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify**

Run (in `D:\dinkzone\apps\web`): `npx tsc --noEmit`
Expected: no output (exit 0).
Run `npm run dev:web` from repo root, open http://localhost:3000: page background is dark green with faint vertical lines, header is sticky with the orange logo disc, text is off-white. (Pages are not restyled yet; some text will be hard to read — fixed in later tasks.)

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx apps/web/src/components/SiteHeader.tsx apps/web/src/components/SiteFooter.tsx
git commit -m "feat(web): add dark green design tokens, fonts, and app shell"
```

---

### Task 2: UI primitives

**Files (all Create, under `apps/web/src/components/ui/`):**
- `Button.tsx`, `Card.tsx`, `Badge.tsx`, `Field.tsx`, `Page.tsx`, `PageHeader.tsx`, `Feedback.tsx`

**Interfaces (produced, used by Tasks 3–6):**
- `Button.tsx`: `buttonClass(opts?: { variant?: 'primary'|'secondary'|'ghost'|'danger'; size?: 'md'|'sm' }): string`; `Button` (props = `ButtonHTMLAttributes<HTMLButtonElement>` + `variant?`, `size?`); `LinkButton` (props = `ComponentProps<typeof Link>` + `variant?`, `size?`).
- `Card.tsx`: `Card` (props = `HTMLAttributes<HTMLDivElement>` + `interactive?: boolean`).
- `Badge.tsx`: `Badge` (props: `tone?: 'sun'|'lime'|'leaf'|'neutral'|'danger'`, `children`, `className?`).
- `Field.tsx`: `Field` (props: `label: string`, `hint?: string`, `children`), `inputClass: string`, `Input`, `Textarea`, `Select` (each = native element props).
- `Page.tsx`: `Page` (props: `width?: 'sm'|'md'|'lg'` default `'md'`, `children`) → `<main>`.
- `PageHeader.tsx`: `PageHeader` (props: `title: string`, `subtitle?: ReactNode`, `actions?: ReactNode`).
- `Feedback.tsx`: `Notice` (props: `tone?: 'error'|'info'`, `children`), `EmptyState` (props: `title: string`, `children?`, `action?: ReactNode`), `Skeleton` (props: `className?`).

- [ ] **Step 1: `Button.tsx`**

```tsx
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-canvas hover:bg-brand-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-raised',
  ghost: 'text-muted hover:bg-leaf/40 hover:text-ink',
  danger: 'border border-danger/40 text-danger hover:bg-danger/10',
};
const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  sm: 'min-h-11 px-3 text-xs sm:min-h-9',
};

export function buttonClass({ variant = 'primary', size = 'md' }: { variant?: Variant; size?: Size } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant,
  size,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={`${buttonClass({ variant, size })} ${className}`} {...props} />;
}

export function LinkButton({
  variant,
  size,
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={`${buttonClass({ variant, size })} ${className}`} {...props} />;
}
```

- [ ] **Step 2: `Card.tsx`**

```tsx
import type { HTMLAttributes } from 'react';

export function Card({
  interactive = false,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  const hover = interactive
    ? 'transition motion-safe:hover:-translate-y-0.5 hover:border-leaf hover:bg-raised'
    : '';
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-5 ${hover} ${className}`}
      {...props}
    />
  );
}
```

- [ ] **Step 3: `Badge.tsx`**

```tsx
import type { ReactNode } from 'react';

type Tone = 'sun' | 'lime' | 'leaf' | 'neutral' | 'danger';

const tones: Record<Tone, string> = {
  sun: 'bg-sun text-canvas',
  lime: 'bg-lime text-canvas',
  leaf: 'bg-leaf text-ink',
  neutral: 'border border-line bg-raised text-muted',
  danger: 'bg-danger/15 text-danger',
};

export function Badge({
  tone = 'neutral',
  className = '',
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: `Field.tsx`**

```tsx
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export const inputClass =
  'w-full min-h-11 rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-sun';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} className={`${inputClass} ${className}`} {...props} />;
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${inputClass} ${className}`} {...props} />;
}
```

- [ ] **Step 5: `Page.tsx`**

```tsx
import type { ReactNode } from 'react';

const widths = { sm: 'max-w-lg', md: 'max-w-3xl', lg: 'max-w-5xl' } as const;

export function Page({ width = 'md', children }: { width?: keyof typeof widths; children: ReactNode }) {
  return <main className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-12 ${widths[width]}`}>{children}</main>;
}
```

- [ ] **Step 6: `PageHeader.tsx`**

```tsx
import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <div className="mt-2 text-sm text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
```

- [ ] **Step 7: `Feedback.tsx`**

```tsx
import type { ReactNode } from 'react';

export function Notice({ tone = 'error', children }: { tone?: 'error' | 'info'; children: ReactNode }) {
  const styles =
    tone === 'error'
      ? 'border-danger/40 bg-danger/10 text-danger'
      : 'border-sun/40 bg-sun/10 text-sun';
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-raised ${className}`} />;
}
```

- [ ] **Step 8: Verify**

Run (in `apps/web`): `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/components/ui
git commit -m "feat(web): add shared UI primitives"
```

---

### Task 3: Organizer badge, home page, clubs list

**Files:**
- Modify: `apps/web/src/components/CurrentUserBadge.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/clubs/page.tsx`
- Create: `apps/web/src/app/clubs/loading.tsx`

**Interfaces:**
- Consumes: `Button`, `LinkButton`, `Input`, `Page`, `PageHeader`, `Card`, `Badge`, `Notice`, `EmptyState`, `Skeleton` from Task 2.

- [ ] **Step 1: `CurrentUserBadge.tsx`** — keep all state/logic; replace only the two returned JSX blocks and add imports. Add at top: `import { Button } from '@/components/ui/Button'; import { Input } from '@/components/ui/Field';`. Replace the `if (user && !editing)` return with:

```tsx
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted">
          Organizing as <span className="font-semibold text-ink">{user.fullName}</span>
        </span>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Switch
        </Button>
      </div>
    );
```

Replace the final `<form ...>` element's className and children (keep the `onSubmit` handler exactly as is) with:

```tsx
      className="flex flex-wrap items-center gap-2 text-sm"
```
and inside it:
```tsx
      <Input
        className="w-36 !min-h-9"
        placeholder="Your name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        className="w-44 !min-h-9"
        placeholder="you@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button size="sm" type="submit">
        Set organizer
      </Button>
      {user && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            clearCurrentUser();
            setUser(null);
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      )}
      {error && <span className="text-danger">{error}</span>}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
import { LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Page } from '@/components/ui/Page';

const features = [
  { icon: '📅', title: 'Schedule events', text: 'Set the venue, courts and player cap in a minute.' },
  { icon: '✅', title: 'Manage RSVPs', text: 'Approve, waitlist, check in and track payments.' },
  { icon: '🏆', title: 'Run round robins', text: 'Generate matches, enter scores, see live standings.' },
];

export default function Home() {
  return (
    <Page width="lg">
      <section className="py-10 sm:py-16">
        <p className="mb-4 inline-block rounded-full bg-sun px-3 py-1 text-xs font-bold uppercase tracking-wide text-canvas">
          Organizer dashboard
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Run your pickleball club like a <span className="text-brand">pro</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Manage clubs, events and round robins from the browser — everything your players see in
          the app, under your control.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/clubs">View your clubs</LinkButton>
          <LinkButton href="/clubs/new" variant="secondary">
            Create a club
          </LinkButton>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <div aria-hidden className="mb-3 text-2xl">
              {f.icon}
            </div>
            <h2 className="font-display text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </Card>
        ))}
      </section>
    </Page>
  );
}
```

- [ ] **Step 3: Replace `app/clubs/page.tsx`** (data fetching block unchanged)

```tsx
import Link from 'next/link';
import { api } from '@/lib/api';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function ClubsPage() {
  let clubs: Awaited<ReturnType<typeof api.listClubs>> = [];
  let error: string | null = null;
  try {
    clubs = await api.listClubs();
  } catch {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  return (
    <Page width="lg">
      <PageHeader
        title="Your clubs"
        subtitle="Every club you organize, in one place."
        actions={<LinkButton href="/clubs/new">+ Create club</LinkButton>}
      />
      {error && <Notice>{error}</Notice>}
      {!error && clubs.length === 0 && (
        <EmptyState
          title="No clubs yet"
          action={<LinkButton href="/clubs/new">Create your first club</LinkButton>}
        >
          Set your organizer name and email at the top of the page, then create a club.
        </EmptyState>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link href={`/clubs/${club.id}`} className="block h-full rounded-2xl">
              <Card interactive className="h-full">
                <h2 className="font-display text-xl font-semibold">{club.name}</h2>
                {club.description && (
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{club.description}</p>
                )}
                <div className="mt-4">
                  <Badge tone="sun">Join code: {club.joinCode}</Badge>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
```

- [ ] **Step 4: Create `app/clubs/loading.tsx`**

```tsx
import { Page } from '@/components/ui/Page';
import { Skeleton } from '@/components/ui/Feedback';

export default function Loading() {
  return (
    <Page width="lg">
      <Skeleton className="mb-8 h-12 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </Page>
  );
}
```

- [ ] **Step 5: Verify**

Run (in `apps/web`): `npx tsc --noEmit` → exit 0.
Visual: http://localhost:3000 shows hero + 3 feature cards; http://localhost:3000/clubs shows card grid (or empty state / error notice if API is down). Resize to 375px: no horizontal scroll, header wraps cleanly.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/CurrentUserBadge.tsx apps/web/src/app/page.tsx apps/web/src/app/clubs/page.tsx apps/web/src/app/clubs/loading.tsx
git commit -m "feat(web): restyle organizer badge, home, and clubs list"
```

---

### Task 4: Club detail and events list

**Files:**
- Modify: `apps/web/src/lib/api.ts` (add two optional fields to `ClubEvent`)
- Modify: `apps/web/src/app/clubs/[id]/page.tsx`
- Modify: `apps/web/src/app/clubs/[id]/events/page.tsx`

**Interfaces:**
- Consumes: Task 2 primitives.
- Produces: `ClubEvent` gains `skillMin?: string | null; skillMax?: string | null` (Prisma Decimal serializes as string).

- [ ] **Step 1: In `api.ts`**, inside `interface ClubEvent`, add after `status: string;`:

```ts
  skillMin?: string | null;
  skillMax?: string | null;
```

- [ ] **Step 2: Replace `app/clubs/[id]/page.tsx`**

```tsx
import Link from 'next/link';
import { api } from '@/lib/api';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function ClubOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let club: Awaited<ReturnType<typeof api.getClub>> | null = null;
  let error: string | null = null;
  try {
    club = await api.getClub(id);
  } catch {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  if (error || !club) {
    return (
      <Page>
        <Notice>{error ?? 'Club not found.'}</Notice>
        <Link href="/clubs" className="text-sm text-sun underline">
          ← Back to clubs
        </Link>
      </Page>
    );
  }

  return (
    <Page>
      <Link href="/clubs" className="mb-4 inline-block text-sm text-muted hover:text-ink">
        ← All clubs
      </Link>
      <PageHeader
        title={club.name}
        subtitle={
          <>
            {club.description && <p className="mb-2 text-base">{club.description}</p>}
            <Badge tone="sun">Join code: {club.joinCode}</Badge>
          </>
        }
        actions={
          <>
            <LinkButton href={`/clubs/${id}/events`} variant="secondary">
              View events
            </LinkButton>
            <LinkButton href={`/clubs/${id}/events/new`}>+ Create event</LinkButton>
          </>
        }
      />

      <h2 className="mb-3 font-display text-xl font-semibold">Members ({club.members.length})</h2>
      {club.members.length === 0 ? (
        <EmptyState title="No members yet">Share the join code so players can find your club.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {club.members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="font-medium">{m.user?.fullName ?? m.reserveName ?? 'Unknown'}</span>
                <Badge tone={m.role === 'owner' ? 'sun' : m.role === 'cohost' ? 'leaf' : 'neutral'}>
                  {m.role}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}
```

- [ ] **Step 3: Replace `app/clubs/[id]/events/page.tsx`**

```tsx
import Link from 'next/link';
import { api } from '@/lib/api';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function ClubEventsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let events: Awaited<ReturnType<typeof api.listEvents>> = [];
  let error: string | null = null;
  try {
    events = await api.listEvents(id);
  } catch {
    error = 'Could not reach the API yet.';
  }

  return (
    <Page width="lg">
      <Link href={`/clubs/${id}`} className="mb-4 inline-block text-sm text-muted hover:text-ink">
        ← Back to club
      </Link>
      <PageHeader
        title="Events"
        actions={<LinkButton href={`/clubs/${id}/events/new`}>+ Create event</LinkButton>}
      />
      {error && <Notice>{error}</Notice>}
      {!error && events.length === 0 && (
        <EmptyState
          title="No events yet"
          action={<LinkButton href={`/clubs/${id}/events/new`}>Create an event</LinkButton>}
        >
          Schedule your first open play session.
        </EmptyState>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <li key={event.id}>
            <Link href={`/clubs/${id}/events/${event.id}`} className="block h-full rounded-2xl">
              <Card interactive className="h-full">
                <h2 className="font-display text-xl font-semibold">{event.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {event.venue} · {new Date(event.startsAt).toLocaleString()}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="leaf">{event.status}</Badge>
                  <Badge>{event.maxPlayers} players</Badge>
                  <Badge>{event.courtCount} courts</Badge>
                  {event.skillMin && event.skillMax && (
                    <Badge tone="lime">
                      Skill {event.skillMin}–{event.skillMax}
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
```

- [ ] **Step 4: Verify**

Run (in `apps/web`): `npx tsc --noEmit` → exit 0.
Visual: open a club and its events page; check cards, badges, back links, 375px width.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/api.ts "apps/web/src/app/clubs/[id]/page.tsx" "apps/web/src/app/clubs/[id]/events/page.tsx"
git commit -m "feat(web): restyle club detail and events list"
```

---

### Task 5: Create-club and create-event forms

**Files:**
- Modify: `apps/web/src/app/clubs/new/page.tsx`
- Modify: `apps/web/src/app/clubs/[id]/events/new/page.tsx`

**Interfaces:**
- Consumes: `Page`, `PageHeader`, `Card`, `Field`, `Input`, `Textarea`, `Button`, `Notice`.

All state, `handleSubmit`, and API calls stay exactly as they are; only imports and the returned JSX change.

- [ ] **Step 1: `clubs/new/page.tsx`** — add imports

```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';
```
and replace the `return (...)` with:

```tsx
  return (
    <Page width="sm">
      <PageHeader title="Create a club" subtitle="Players join with the code we generate." />
      <Card>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field label="Club name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tuesday Night Open Play"
              required
            />
          </Field>
          <Field label="Description (optional)">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Weekly open play at Sunrise Courts, all levels welcome."
            />
          </Field>
          {error && <Notice>{error}</Notice>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create club'}
          </Button>
        </form>
      </Card>
    </Page>
  );
```

- [ ] **Step 2: `clubs/[id]/events/new/page.tsx`** — add the same imports and replace the `return (...)` with:

```tsx
  return (
    <Page width="sm">
      <PageHeader title="Create an event" subtitle="Players can RSVP as soon as it's saved." />
      <Card>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tuesday Open Play"
              required
            />
          </Field>
          <Field label="Venue">
            <Input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Sunrise Courts"
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Starts">
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
            </Field>
            <Field label="Ends">
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Courts">
              <Input
                type="number"
                min={1}
                value={courtCount}
                onChange={(e) => setCourtCount(Number(e.target.value))}
              />
            </Field>
            <Field label="Max players">
              <Input
                type="number"
                min={2}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </Field>
          </div>
          {error && <Notice>{error}</Notice>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create event'}
          </Button>
        </form>
      </Card>
    </Page>
  );
```

- [ ] **Step 3: Verify**

Run (in `apps/web`): `npx tsc --noEmit` → exit 0.
Visual: both forms render in a centered card; Tab through fields — yellow focus outline visible; datetime inputs usable on dark background (browser calendar icon may be dark: if so, add `[color-scheme:dark]` — already inherited from `html { color-scheme: dark }`, so it should be light). Submit with the API down shows the red notice.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/clubs/new/page.tsx "apps/web/src/app/clubs/[id]/events/new/page.tsx"
git commit -m "feat(web): restyle create club and create event forms"
```

---

### Task 6: Event detail, RSVP panel, matches panel

**Files:**
- Modify: `apps/web/src/app/clubs/[id]/events/[eventId]/page.tsx`
- Modify: `apps/web/src/components/RsvpPanel.tsx`
- Modify: `apps/web/src/components/MatchesPanel.tsx`

**Interfaces:**
- Consumes: Task 2 primitives. Existing component props are unchanged: `RsvpPanel({ eventId, rsvps, members })`, `MatchesPanel({ eventId, courtCount, matches })`.

- [ ] **Step 1: Replace `[eventId]/page.tsx`** (fetching block unchanged)

```tsx
import Link from 'next/link';
import { api } from '@/lib/api';
import RsvpPanel from '@/components/RsvpPanel';
import MatchesPanel from '@/components/MatchesPanel';
import { Badge } from '@/components/ui/Badge';
import { Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const { id: clubId, eventId } = await params;

  let event: Awaited<ReturnType<typeof api.getEvent>> | null = null;
  let members: Awaited<ReturnType<typeof api.getClubMembers>> = [];
  let error: string | null = null;
  try {
    [event, members] = await Promise.all([api.getEvent(eventId), api.getClubMembers(clubId)]);
  } catch {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  if (error || !event) {
    return (
      <Page>
        <Notice>{error ?? 'Event not found.'}</Notice>
      </Page>
    );
  }

  return (
    <Page>
      <Link href={`/clubs/${clubId}/events`} className="mb-4 inline-block text-sm text-muted hover:text-ink">
        ← All events
      </Link>
      <PageHeader
        title={event.title}
        subtitle={
          <>
            <p>
              {event.venue} · {new Date(event.startsAt).toLocaleString()}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="leaf">{event.status}</Badge>
              <Badge>{event.courtCount} courts</Badge>
              <Badge>max {event.maxPlayers} players</Badge>
            </div>
          </>
        }
      />

      <RsvpPanel eventId={eventId} rsvps={event.rsvps} members={members} />
      <MatchesPanel eventId={eventId} courtCount={event.courtCount} matches={event.matches} />
    </Page>
  );
}
```

- [ ] **Step 2: `RsvpPanel.tsx`** — keep `STATUS_LABEL`, props, state, `active/approved/waitlisted`, `run`, `nameFor` unchanged. Add imports

```tsx
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Field, Input, Select } from '@/components/ui/Field';
```
add above the component:

```tsx
const STATUS_TONE: Record<EventRsvp['status'], 'lime' | 'sun' | 'neutral' | 'danger'> = {
  approved: 'lime',
  checked_in: 'lime',
  requested: 'sun',
  waitlisted: 'sun',
  cancelled: 'neutral',
  no_show: 'danger',
};
```
and replace the `return (...)` with:

```tsx
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-2xl font-semibold">
        RSVPs
        <span className="ml-3 align-middle text-sm font-normal text-muted">
          {approved.length} approved · {waitlisted.length} waitlisted
        </span>
      </h2>

      <Card className="mb-4">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (memberId) {
              run('rsvp', () => api.rsvp(eventId, { userId: memberId }));
              setMemberId('');
            } else if (reserveName.trim()) {
              run('rsvp', () => api.rsvp(eventId, { reserveName: reserveName.trim() }));
              setReserveName('');
            }
          }}
        >
          <div className="min-w-44 flex-1">
            <Field label="Add a club member">
              <Select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">Select member…</option>
                {members
                  .filter((m) => m.user)
                  .map((m) => (
                    <option key={m.id} value={m.user!.id}>
                      {m.user!.fullName}
                    </option>
                  ))}
              </Select>
            </Field>
          </div>
          <span className="pb-3 text-xs text-muted">or</span>
          <div className="min-w-44 flex-1">
            <Field label="Add a reserve (no app account)">
              <Input
                placeholder="Guest name"
                value={reserveName}
                onChange={(e) => setReserveName(e.target.value)}
              />
            </Field>
          </div>
          <Button type="submit">Add RSVP</Button>
        </form>
      </Card>
      {error && <Notice>{error}</Notice>}

      {active.length === 0 ? (
        <EmptyState title="No RSVPs yet">Add a member or a guest above.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {active.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{nameFor(r)}</span>
                  <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                  {r.waitlistPosition != null && (
                    <span className="text-xs text-muted">#{r.waitlistPosition}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {r.status === 'approved' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy === r.id}
                      onClick={() => run(r.id, () => api.checkIn(r.id))}
                    >
                      Check in
                    </Button>
                  )}
                  <Button
                    variant={r.paid ? 'ghost' : 'secondary'}
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() => run(r.id, () => api.markPaid(r.id, !r.paid))}
                  >
                    {r.paid ? 'Paid ✓' : 'Mark paid'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() => run(r.id, () => api.cancelRsvp(r.id))}
                  >
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
```

- [ ] **Step 3: `MatchesPanel.tsx`** — keep `participantNames`, props, state, effects, `rounds`, `nameByKey`, `generate`, `submitScore` unchanged. Add imports

```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Input } from '@/components/ui/Field';
```
and replace the `return (...)` with:

```tsx
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Matches</h2>
        <Button onClick={generate} disabled={generating}>
          {matches.length > 0
            ? generating
              ? 'Regenerating…'
              : 'Regenerate matches'
            : generating
              ? 'Generating…'
              : 'Generate matches'}
        </Button>
      </div>
      {error && <Notice>{error}</Notice>}

      {matches.length === 0 && (
        <EmptyState title="No matches yet">
          Approve RSVPs above, then generate a round robin.
        </EmptyState>
      )}

      {rounds.map((round) => (
        <div key={round} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sun">
            Round {round}
          </h3>
          <Card className="p-0">
            <ul className="divide-y divide-line">
              {matches
                .filter((m) => m.roundNumber === round)
                .map((m) => {
                  const score = m.scores[m.scores.length - 1];
                  return (
                    <li
                      key={m.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
                    >
                      <span>
                        <span className="mr-2 rounded-md bg-leaf px-2 py-0.5 text-xs font-semibold">
                          Court {m.courtNumber}
                        </span>
                        {participantNames(m, 1)} <span className="text-muted">vs</span>{' '}
                        {participantNames(m, 2)}
                      </span>
                      {score ? (
                        <span className="font-display text-lg font-bold text-lime">
                          {score.team1Score} – {score.team2Score}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            aria-label="Team 1 score"
                            inputMode="numeric"
                            className="w-16 text-center"
                            placeholder="0"
                            value={scores[m.id]?.t1 ?? ''}
                            onChange={(e) =>
                              setScores((s) => ({
                                ...s,
                                [m.id]: { t1: e.target.value, t2: s[m.id]?.t2 ?? '' },
                              }))
                            }
                          />
                          <span className="text-muted">–</span>
                          <Input
                            aria-label="Team 2 score"
                            inputMode="numeric"
                            className="w-16 text-center"
                            placeholder="0"
                            value={scores[m.id]?.t2 ?? ''}
                            onChange={(e) =>
                              setScores((s) => ({
                                ...s,
                                [m.id]: { t1: s[m.id]?.t1 ?? '', t2: e.target.value },
                              }))
                            }
                          />
                          <Button variant="secondary" size="sm" onClick={() => submitScore(m.id)}>
                            Save
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          </Card>
        </div>
      ))}

      {standings && Object.keys(standings).length > 0 && (
        <div className="mt-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sun">Standings</h3>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="px-5 py-3 font-medium">Player</th>
                  <th className="px-3 py-3 text-right font-medium">W</th>
                  <th className="px-3 py-3 text-right font-medium">L</th>
                  <th className="px-5 py-3 text-right font-medium">Point diff</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(standings)
                  .sort((a, b) => b[1].wins - a[1].wins || b[1].pointDiff - a[1].pointDiff)
                  .map(([key, s], i) => (
                    <tr key={key} className="border-t border-line">
                      <td className="px-5 py-3 font-medium">
                        {i === 0 && <span aria-hidden>🥇 </span>}
                        {nameByKey[key] ?? key}
                      </td>
                      <td className="px-3 py-3 text-right text-lime">{s.wins}</td>
                      <td className="px-3 py-3 text-right">{s.losses}</td>
                      <td className="px-5 py-3 text-right">{s.pointDiff}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </section>
  );
```

- [ ] **Step 4: Verify**

Run (in `apps/web`): `npx tsc --noEmit` → exit 0.
Visual (needs API + DB running): open an event; add an RSVP, check in, mark paid, cancel; generate matches, save a score, confirm standings table. At 375px the RSVP rows wrap and the standings table scrolls inside its card (page itself does not scroll sideways).

- [ ] **Step 5: Commit**

```bash
git add "apps/web/src/app/clubs/[id]/events/[eventId]/page.tsx" apps/web/src/components/RsvpPanel.tsx apps/web/src/components/MatchesPanel.tsx
git commit -m "feat(web): restyle event detail, RSVP panel, and matches panel"
```

---

### Task 7: Final verification and cleanup

**Files:** none expected; fix anything the checks surface.

- [ ] **Step 1: Leftover old styles**

Run (repo root): `grep -rnE "bg-black|text-gray-|border-gray|divide-gray|text-red-|bg-white" apps/web/src`
Expected: no matches. Fix any hit by switching to the tokens (`bg-brand`, `text-muted`, `divide-line`, `text-danger`, ...).

- [ ] **Step 2: Lint and type-check**

Run (in `apps/web`): `npx tsc --noEmit` then `npm run lint`
Expected: both exit 0. Fix reported issues.

- [ ] **Step 3: Production build**

Run (repo root): `npm run build --workspace=apps/web`
Expected: build succeeds (needs network for Google Fonts on first run).

- [ ] **Step 4: Contrast spot-check**

Confirm these ratios are >= 4.5:1 using any contrast checker (values computed from the hex codes):
- `ink #f4f1e6` on `canvas #0b1a05` and on `surface #12260a`
- `muted #a9bd96` on `surface #12260a`
- `canvas #0b1a05` text on `brand #ff4a01`, `sun #ffd900`, `lime #d8d92e`
- `ink #f4f1e6` on `leaf #396c03`
- `danger #ff8a7a` on `surface #12260a`
If a pair fails, adjust the token in `globals.css` (lighten the text color) and re-run Step 3.

- [ ] **Step 5: Manual walkthrough**

With `npm run dev` from the repo root, visit every route at desktop width and 375px: `/`, `/clubs`, `/clubs/new`, a club, its events, `/clubs/<id>/events/new`, an event. Check: no horizontal scroll, Tab shows a yellow focus outline on every control, nothing white/black-on-default left over.

- [ ] **Step 6: Commit any fixes**

```bash
git add apps/web
git commit -m "fix(web): final UI redesign polish"
```
(Skip if nothing changed.)

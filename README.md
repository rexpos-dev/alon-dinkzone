# Pickleball Reclub Clone

A pickleball club organizer app — a clone/evolution of [Reclub](https://pickleball.reclub.co/for-organizers) — with a mobile app for players, a web dashboard for organizers, and in-app payments as a Phase 2 differentiator.

Full product and technical docs live in this project's Claude Project ("pickleball reclub concept"):
- **Product Requirements Document** — scope, personas, feature phases, user stories
- **Technical Architecture & Database Schema** — tech stack, system design, full DB schema, API design
- **Development Roadmap** — team, sprint plan, milestones, risks

This repo is the Phase 1 code scaffold described in those docs.

## Structure

```
apps/
  mobile/   React Native (Expo) app — players use this
  web/      Next.js organizer dashboard — club/event management, reports
  api/      NestJS backend (Prisma + PostgreSQL) — shared by both frontends
packages/
  shared-types/   TypeScript interfaces shared across all three apps
```

## Getting started

### 1. Install dependencies
From the repo root (uses npm workspaces):
```
npm install
```

### 2. One-time env setup
```
cp apps/api/.env.example apps/api/.env       # then set DATABASE_URL to a real Postgres instance
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cd apps/api && npm run prisma:generate && npm run prisma:migrate && cd ../..
```

### 3. Run everything from the repo root
No need to `cd` into each app — these all run from `D:\dinkzone` (the repo root):
```
npm run build        # builds apps/api then apps/web
npm run build:api     # just the backend
npm run build:web     # just the web dashboard

npm run dev           # runs apps/api (watch mode) + apps/web (dev server) together, side by side in one terminal
npm run dev:api        # just the backend, on http://localhost:3001/api/v1
npm run dev:web        # just the web dashboard, on http://localhost:3000
npm run dev:mobile     # Expo dev tools for the mobile app (kept separate — it's interactive/QR-code based, doesn't mix well with the other two in one terminal)
```

### 4. Mobile app (apps/mobile) — still run from its own folder
Expo's dev tools are interactive (QR code, keyboard shortcuts), so it's kept out of the root `dev`/`build` scripts on purpose:
```
cd apps/mobile
npm run start              # opens Expo dev tools; scan the QR with Expo Go
```

## What's scaffolded vs. what's next

Already in place (Phase 1 shape, see Technical Architecture doc §2 and §6):
- Prisma schema for Users, Clubs, ClubMembers, Events, EventRsvps, Matches, MatchParticipants, MatchScores
- NestJS modules: auth (stub), users (incl. find-or-create), clubs (create/join/list/members), events (create/RSVP+waitlist/check-in/mark-paid/cancel), matches (round-robin generator, scoring, standings), notifications (stub)
- Next.js organizer dashboard: create/view clubs, create/view events, manage RSVPs & waitlist (check-in, mark paid, cancel), generate round robins, enter scores, live standings — all wired to the real API
- Expo app: 4-tab navigation shell (Discover / My Clubs / Activity / Profile) matching the PRD's persona flows — screens are still placeholders

Still to build for a real Phase 1 launch:
- Real auth provider integration (Firebase Auth or Auth0) in place of the auth stub (API) and the localStorage stand-in (web)
- Push notifications wired to FCM/APNs in `notifications.service.ts`
- Mobile UI for creating clubs/events, RSVPing, and live scoring (currently placeholder screens)
- Offline queue for scoring/check-in on weak court wifi (Technical Architecture doc §3)
- Round robin formats beyond singles (rotating partners, fixed pairs)

Phase 2+ (DUPR integration, payments, Supporter subscription, Kudos/Street Cred) are intentionally not scaffolded yet — see the Roadmap doc for sequencing.

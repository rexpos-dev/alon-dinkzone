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

### 2. Backend (apps/api)
```
cd apps/api
cp .env.example .env     # then set DATABASE_URL to a real Postgres instance
npm run prisma:generate
npm run prisma:migrate   # creates the Phase 1 tables from prisma/schema.prisma
npm run start:dev        # runs on http://localhost:3001/api/v1
```

### 3. Web dashboard (apps/web)
```
cd apps/web
cp .env.example .env.local
npm run dev               # runs on http://localhost:3000, talks to the API above
```

### 4. Mobile app (apps/mobile)
```
cd apps/mobile
cp .env.example .env
npm run start              # opens Expo dev tools; scan the QR with Expo Go
```

## What's scaffolded vs. what's next

Already in place (Phase 1 shape, see Technical Architecture doc §2 and §6):
- Prisma schema for Users, Clubs, ClubMembers, Events, EventRsvps, Matches, MatchParticipants, MatchScores
- NestJS modules: auth (stub), users, clubs (create/join/list/members), events (create/RSVP/waitlist/check-in), matches (round-robin generator, scoring, standings), notifications (stub)
- Next.js dashboard: clubs list, club events list, calling the real API
- Expo app: 4-tab navigation shell (Discover / My Clubs / Activity / Profile) matching the PRD's persona flows

Still to build for a real Phase 1 launch:
- Real auth provider integration (Firebase Auth or Auth0) in place of the auth stub
- Push notifications wired to FCM/APNs in `notifications.service.ts`
- UI for creating clubs/events and RSVPing from the mobile app (screens currently placeholders)
- Offline queue for scoring/check-in on weak court wifi (Technical Architecture doc §3)
- Round robin formats beyond singles (rotating partners, fixed pairs)

Phase 2+ (DUPR integration, payments, Supporter subscription, Kudos/Street Cred) are intentionally not scaffolded yet — see the Roadmap doc for sequencing.

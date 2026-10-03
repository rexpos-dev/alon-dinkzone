// Shared TypeScript types for the Pickleball Reclub Clone monorepo.
// Mirrors the Phase 1 database schema described in the project's
// "Technical Architecture & Database Schema" doc.

export type UUID = string;

export type ClubRole = "owner" | "cohost" | "member";
export type ClubPrivacy = "public" | "invite_only";

export interface User {
  id: UUID;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  selfReportedSkill?: number | null; // e.g. 3.5
  duprId?: string | null; // Phase 2
  isSupporter: boolean; // Phase 2 subscription flag
  createdAt: string;
  updatedAt: string;
}

export interface Club {
  id: UUID;
  ownerId: UUID;
  name: string;
  sport: string; // default "pickleball"
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  privacy: ClubPrivacy;
  joinCode: string;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMember {
  id: UUID;
  clubId: UUID;
  userId?: UUID | null; // null when this is a reserve placeholder
  reserveName?: string | null;
  role: ClubRole;
  joinedAt: string;
}

export type EventStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface ClubEvent {
  id: UUID;
  clubId: UUID;
  title: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  recurrenceRule?: string | null; // RFC 5545 RRULE
  courtCount: number;
  maxPlayers: number;
  skillMin?: number | null;
  skillMax?: number | null;
  autoApproveRsvp: boolean;
  status: EventStatus;
  createdBy: UUID;
}

export type RsvpStatus =
  | "requested"
  | "approved"
  | "waitlisted"
  | "checked_in"
  | "cancelled"
  | "no_show";

export interface EventRsvp {
  id: UUID;
  eventId: UUID;
  userId?: UUID | null;
  reserveName?: string | null;
  status: RsvpStatus;
  paid: boolean;
  waitlistPosition?: number | null;
  respondedAt: string;
}

export type MatchFormat =
  | "singles"
  | "rotating_partners"
  | "fixed_pairs"
  | "pool" // Phase 2
  | "single_elim"; // Phase 2

export type MatchStatus = "pending" | "in_progress" | "completed";

export interface Match {
  id: UUID;
  eventId: UUID;
  roundNumber: number;
  courtNumber: number;
  format: MatchFormat;
  status: MatchStatus;
}

export interface MatchParticipant {
  id: UUID;
  matchId: UUID;
  userId?: UUID | null;
  reserveName?: string | null;
  team: 1 | 2;
}

export interface MatchScore {
  id: UUID;
  matchId: UUID;
  team1Score: number;
  team2Score: number;
  submittedBy: UUID;
  submittedAt: string;
}

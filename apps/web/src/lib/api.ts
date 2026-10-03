// API client for the organizer web dashboard.
// Points at the NestJS backend (see apps/api).

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface AppUser {
  id: string;
  fullName: string;
  email?: string | null;
}

export interface Club {
  id: string;
  name: string;
  sport: string;
  description?: string | null;
  joinCode: string;
  ownerId: string;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId?: string | null;
  reserveName?: string | null;
  role: 'owner' | 'cohost' | 'member';
  user?: AppUser | null;
}

export interface ClubEvent {
  id: string;
  clubId: string;
  title: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  courtCount: number;
  maxPlayers: number;
  status: string;
}

export interface EventRsvp {
  id: string;
  eventId: string;
  userId?: string | null;
  reserveName?: string | null;
  status: 'requested' | 'approved' | 'waitlisted' | 'checked_in' | 'cancelled' | 'no_show';
  paid: boolean;
  waitlistPosition?: number | null;
  user?: AppUser | null;
}

export interface MatchParticipant {
  id: string;
  userId?: string | null;
  reserveName?: string | null;
  team: number;
  user?: AppUser | null;
}

export interface MatchScore {
  id: string;
  team1Score: number;
  team2Score: number;
}

export interface Match {
  id: string;
  roundNumber: number;
  courtNumber: number;
  format: string;
  status: string;
  participants: MatchParticipant[];
  scores: MatchScore[];
}

export interface EventDetail extends ClubEvent {
  club: Club;
  rsvps: EventRsvp[];
  matches: Match[];
}

export type Standings = Record<string, { wins: number; losses: number; pointDiff: number }>;

export const api = {
  // Users
  upsertUser: (data: { fullName: string; email: string }) =>
    request<AppUser>('/users', { method: 'POST', body: JSON.stringify(data) }),

  // Clubs
  listClubs: () => request<Club[]>('/clubs'),
  getClub: (id: string) => request<Club & { members: ClubMember[] }>(`/clubs/${id}`),
  getClubMembers: (id: string) => request<ClubMember[]>(`/clubs/${id}/members`),
  createClub: (data: { ownerId: string; name: string; description?: string }) =>
    request<Club>('/clubs', { method: 'POST', body: JSON.stringify(data) }),

  // Events
  listEvents: (clubId: string) => request<ClubEvent[]>(`/events?clubId=${clubId}`),
  getEvent: (id: string) => request<EventDetail>(`/events/${id}`),
  createEvent: (data: {
    clubId: string;
    title: string;
    venue: string;
    startsAt: string;
    endsAt: string;
    courtCount: number;
    maxPlayers: number;
    createdBy: string;
  }) => request<ClubEvent>('/events', { method: 'POST', body: JSON.stringify(data) }),
  rsvp: (eventId: string, data: { userId?: string; reserveName?: string }) =>
    request<EventRsvp>(`/events/${eventId}/rsvp`, { method: 'POST', body: JSON.stringify(data) }),
  checkIn: (rsvpId: string) => request(`/events/rsvps/${rsvpId}/check-in`, { method: 'POST' }),
  markPaid: (rsvpId: string, paid: boolean) =>
    request(`/events/rsvps/${rsvpId}/paid`, { method: 'POST', body: JSON.stringify({ paid }) }),
  cancelRsvp: (rsvpId: string) => request(`/events/rsvps/${rsvpId}/cancel`, { method: 'POST' }),

  // Matches
  generateMatches: (eventId: string, courtCount: number) =>
    request(`/events/${eventId}/generate-matches`, {
      method: 'POST',
      body: JSON.stringify({ courtCount }),
    }),
  submitScore: (matchId: string, data: { submittedBy: string; team1Score: number; team2Score: number }) =>
    request(`/matches/${matchId}/score`, { method: 'POST', body: JSON.stringify(data) }),
  getStandings: (eventId: string) => request<Standings>(`/events/${eventId}/standings`),
};

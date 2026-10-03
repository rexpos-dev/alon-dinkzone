// Minimal API client for the organizer web dashboard.
// Points at the NestJS backend (see apps/api).

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export interface Club {
  id: string;
  name: string;
  sport: string;
  description?: string | null;
  joinCode: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  venue: string;
  startsAt: string;
  endsAt: string;
  maxPlayers: number;
  status: string;
}

export const api = {
  listClubs: () => request<Club[]>('/clubs'),
  getClub: (id: string) => request<Club>(`/clubs/${id}`),
  listEvents: (clubId: string) => request<ClubEvent[]>(`/events?clubId=${clubId}`),
  getEventStandings: (eventId: string) =>
    request<Record<string, { wins: number; losses: number; pointDiff: number }>>(
      `/events/${eventId}/standings`,
    ),
};

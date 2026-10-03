import { api } from '@/lib/api';
import RsvpPanel from '@/components/RsvpPanel';
import MatchesPanel from '@/components/MatchesPanel';

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
      <main className="mx-auto max-w-3xl p-8">
        <p className="text-sm text-red-600">{error ?? 'Event not found.'}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <p className="mb-8 text-sm text-gray-500">
        {event.venue} · {new Date(event.startsAt).toLocaleString()} · {event.courtCount} courts ·
        max {event.maxPlayers} players
      </p>

      <RsvpPanel eventId={eventId} rsvps={event.rsvps} members={members} />
      <MatchesPanel eventId={eventId} courtCount={event.courtCount} matches={event.matches} />
    </main>
  );
}

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

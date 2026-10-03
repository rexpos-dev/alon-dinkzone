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

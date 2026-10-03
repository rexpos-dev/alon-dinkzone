import { api } from '@/lib/api';

export default async function ClubEventsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let events: Awaited<ReturnType<typeof api.listEvents>> = [];
  let error: string | null = null;
  try {
    events = await api.listEvents(id);
  } catch (e) {
    error = 'Could not reach the API yet.';
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Events</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id} className="py-4">
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">
              {event.venue} · {new Date(event.startsAt).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              Status: {event.status} · Max players: {event.maxPlayers}
            </p>
          </li>
        ))}
        {!error && events.length === 0 && (
          <li className="py-4 text-sm text-gray-500">No events yet for this club.</li>
        )}
      </ul>
    </main>
  );
}

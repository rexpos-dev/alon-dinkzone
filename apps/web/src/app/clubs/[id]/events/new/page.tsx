'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/currentUser';

export default function NewEventPage() {
  const router = useRouter();
  const { id: clubId } = useParams<{ id: string }>();

  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [courtCount, setCourtCount] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(16);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      setError('Set your organizer name/email at the top of the page first.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const event = await api.createEvent({
        clubId,
        title,
        venue,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        courtCount,
        maxPlayers,
        createdBy: user.id,
      });
      router.push(`/clubs/${clubId}/events/${event.id}`);
    } catch {
      setError('Could not create the event — is the API running?');
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold">Create an event</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Title</span>
          <input
            className="rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tuesday Open Play"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Venue</span>
          <input
            className="rounded border px-3 py-2"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Sunrise Courts"
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Starts</span>
            <input
              className="rounded border px-3 py-2"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Ends</span>
            <input
              className="rounded border px-3 py-2"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Courts</span>
            <input
              className="rounded border px-3 py-2"
              type="number"
              min={1}
              value={courtCount}
              onChange={(e) => setCourtCount(Number(e.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Max players</span>
            <input
              className="rounded border px-3 py-2"
              type="number"
              min={2}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Creating…' : 'Create event'}
        </button>
      </form>
    </main>
  );
}

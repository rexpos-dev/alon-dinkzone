'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/currentUser';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

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
    <Page width="sm">
      <PageHeader title="Create an event" subtitle="Players can RSVP as soon as it's saved." />
      <Card>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field label="Title">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tuesday Open Play"
              required
            />
          </Field>
          <Field label="Venue">
            <Input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Sunrise Courts"
              required
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Starts">
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
            </Field>
            <Field label="Ends">
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Courts">
              <Input
                type="number"
                min={1}
                value={courtCount}
                onChange={(e) => setCourtCount(Number(e.target.value))}
              />
            </Field>
            <Field label="Max players">
              <Input
                type="number"
                min={2}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
              />
            </Field>
          </div>
          {error && <Notice>{error}</Notice>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create event'}
          </Button>
        </form>
      </Card>
    </Page>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, type ClubMember, type EventRsvp } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Field, Input, Select } from '@/components/ui/Field';

const STATUS_LABEL: Record<EventRsvp['status'], string> = {
  requested: 'Requested',
  approved: 'Approved',
  waitlisted: 'Waitlisted',
  checked_in: 'Checked in',
  cancelled: 'Cancelled',
  no_show: 'No-show',
};

const STATUS_TONE: Record<EventRsvp['status'], 'lime' | 'sun' | 'neutral' | 'danger'> = {
  approved: 'lime',
  checked_in: 'lime',
  requested: 'sun',
  waitlisted: 'sun',
  cancelled: 'neutral',
  no_show: 'danger',
};

export default function RsvpPanel({
  eventId,
  rsvps,
  members,
}: {
  eventId: string;
  rsvps: EventRsvp[];
  members: ClubMember[];
}) {
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [reserveName, setReserveName] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const active = rsvps.filter((r) => r.status !== 'cancelled');
  const approved = active.filter((r) => r.status === 'approved' || r.status === 'checked_in');
  const waitlisted = active.filter((r) => r.status === 'waitlisted');

  async function run(label: string, fn: () => Promise<unknown>) {
    setBusy(label);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch {
      setError('That action failed — is the API running?');
    } finally {
      setBusy(null);
    }
  }

  function nameFor(r: EventRsvp) {
    return r.user?.fullName ?? r.reserveName ?? 'Unknown';
  }

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-display text-2xl font-semibold">
        RSVPs
        <span className="ml-3 align-middle text-sm font-normal text-muted">
          {approved.length} approved · {waitlisted.length} waitlisted
        </span>
      </h2>

      <Card className="mb-4">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (memberId) {
              run('rsvp', () => api.rsvp(eventId, { userId: memberId }));
              setMemberId('');
            } else if (reserveName.trim()) {
              run('rsvp', () => api.rsvp(eventId, { reserveName: reserveName.trim() }));
              setReserveName('');
            }
          }}
        >
          <div className="min-w-44 flex-1">
            <Field label="Add a club member">
              <Select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
                <option value="">Select member…</option>
                {members
                  .filter((m) => m.user)
                  .map((m) => (
                    <option key={m.id} value={m.user!.id}>
                      {m.user!.fullName}
                    </option>
                  ))}
              </Select>
            </Field>
          </div>
          <span className="pb-3 text-xs text-muted">or</span>
          <div className="min-w-44 flex-1">
            <Field label="Add a reserve (no app account)">
              <Input
                placeholder="Guest name"
                value={reserveName}
                onChange={(e) => setReserveName(e.target.value)}
              />
            </Field>
          </div>
          <Button type="submit">Add RSVP</Button>
        </form>
      </Card>
      {error && <Notice>{error}</Notice>}

      {active.length === 0 ? (
        <EmptyState title="No RSVPs yet">Add a member or a guest above.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {active.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{nameFor(r)}</span>
                  <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                  {r.waitlistPosition != null && (
                    <span className="text-xs text-muted">#{r.waitlistPosition}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {r.status === 'approved' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy === r.id}
                      onClick={() => run(r.id, () => api.checkIn(r.id))}
                    >
                      Check in
                    </Button>
                  )}
                  <Button
                    variant={r.paid ? 'ghost' : 'secondary'}
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() => run(r.id, () => api.markPaid(r.id, !r.paid))}
                  >
                    {r.paid ? 'Paid ✓' : 'Mark paid'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={busy === r.id}
                    onClick={() => run(r.id, () => api.cancelRsvp(r.id))}
                  >
                    Cancel
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

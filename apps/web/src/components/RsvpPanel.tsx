'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, type ClubMember, type EventRsvp } from '@/lib/api';

const STATUS_LABEL: Record<EventRsvp['status'], string> = {
  requested: 'Requested',
  approved: 'Approved',
  waitlisted: 'Waitlisted',
  checked_in: 'Checked in',
  cancelled: 'Cancelled',
  no_show: 'No-show',
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
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-medium">
        RSVPs — {approved.length} approved, {waitlisted.length} waitlisted
      </h2>

      <form
        className="mb-4 flex flex-wrap items-end gap-2 text-sm"
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
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Add a club member</span>
          <select
            className="rounded border px-2 py-1"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">Select member…</option>
            {members
              .filter((m) => m.user)
              .map((m) => (
                <option key={m.id} value={m.user!.id}>
                  {m.user!.fullName}
                </option>
              ))}
          </select>
        </label>
        <span className="pb-2 text-xs text-gray-400">or</span>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Add a reserve (no app account)</span>
          <input
            className="rounded border px-2 py-1"
            placeholder="Guest name"
            value={reserveName}
            onChange={(e) => setReserveName(e.target.value)}
          />
        </label>
        <button className="rounded bg-black px-3 py-1.5 text-white" type="submit">
          Add RSVP
        </button>
      </form>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <ul className="divide-y divide-gray-200">
        {active.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
            <div>
              <span className="font-medium">{nameFor(r)}</span>{' '}
              <span className="text-xs uppercase text-gray-400">{STATUS_LABEL[r.status]}</span>
              {r.waitlistPosition != null && (
                <span className="ml-1 text-xs text-gray-400">#{r.waitlistPosition}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {r.status === 'approved' && (
                <button
                  className="text-xs underline disabled:opacity-50"
                  disabled={busy === r.id}
                  onClick={() => run(r.id, () => api.checkIn(r.id))}
                >
                  Check in
                </button>
              )}
              <button
                className="text-xs underline disabled:opacity-50"
                disabled={busy === r.id}
                onClick={() => run(r.id, () => api.markPaid(r.id, !r.paid))}
              >
                {r.paid ? 'Paid ✓' : 'Mark paid'}
              </button>
              <button
                className="text-xs text-red-500 underline disabled:opacity-50"
                disabled={busy === r.id}
                onClick={() => run(r.id, () => api.cancelRsvp(r.id))}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
        {active.length === 0 && (
          <li className="py-3 text-sm text-gray-500">No RSVPs yet.</li>
        )}
      </ul>
    </section>
  );
}

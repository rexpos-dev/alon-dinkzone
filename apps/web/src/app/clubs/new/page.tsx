'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/currentUser';

export default function NewClubPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
      const club = await api.createClub({ ownerId: user.id, name, description });
      router.push(`/clubs/${club.id}`);
    } catch {
      setError('Could not create the club — is the API running?');
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="mb-6 text-2xl font-semibold">Create a club</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Club name</span>
          <input
            className="rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tuesday Night Open Play"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Description (optional)</span>
          <textarea
            className="rounded border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Weekly open play at Sunrise Courts, all levels welcome."
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Creating…' : 'Create club'}
        </button>
      </form>
    </main>
  );
}

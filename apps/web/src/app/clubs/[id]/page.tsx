import Link from 'next/link';
import { api } from '@/lib/api';

export default async function ClubOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let club: Awaited<ReturnType<typeof api.getClub>> | null = null;
  let error: string | null = null;
  try {
    club = await api.getClub(id);
  } catch {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  if (error || !club) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p className="text-sm text-red-600">{error ?? 'Club not found.'}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{club.name}</h1>
          {club.description && <p className="mt-1 text-gray-600">{club.description}</p>}
          <p className="mt-2 text-sm text-gray-400">
            Join code: <span className="font-mono">{club.joinCode}</span>
          </p>
        </div>
        <Link
          href={`/clubs/${id}/events/new`}
          className="shrink-0 rounded bg-black px-4 py-2 text-sm text-white"
        >
          + Create event
        </Link>
      </div>

      <div className="mb-8">
        <Link href={`/clubs/${id}/events`} className="text-sm underline">
          View all events →
        </Link>
      </div>

      <h2 className="mb-3 text-lg font-medium">Members ({club.members.length})</h2>
      <ul className="divide-y divide-gray-200">
        {club.members.map((m) => (
          <li key={m.id} className="flex items-center justify-between py-3">
            <span>{m.user?.fullName ?? m.reserveName ?? 'Unknown'}</span>
            <span className="text-xs uppercase text-gray-400">{m.role}</span>
          </li>
        ))}
        {club.members.length === 0 && (
          <li className="py-3 text-sm text-gray-500">No members yet.</li>
        )}
      </ul>
    </main>
  );
}

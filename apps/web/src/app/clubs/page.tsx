import Link from 'next/link';
import { api } from '@/lib/api';

export default async function ClubsPage() {
  let clubs: Awaited<ReturnType<typeof api.listClubs>> = [];
  let error: string | null = null;
  try {
    clubs = await api.listClubs();
  } catch {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Clubs</h1>
        <Link href="/clubs/new" className="rounded bg-black px-4 py-2 text-sm text-white">
          + Create club
        </Link>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-gray-200">
        {clubs.map((club) => (
          <li key={club.id} className="py-4">
            <Link href={`/clubs/${club.id}`} className="font-medium hover:underline">
              {club.name}
            </Link>
            <p className="text-sm text-gray-500">{club.description}</p>
            <p className="text-xs text-gray-400">Join code: {club.joinCode}</p>
          </li>
        ))}
        {!error && clubs.length === 0 && (
          <li className="py-4 text-sm text-gray-500">
            No clubs yet. Set your organizer name/email above, then create one.
          </li>
        )}
      </ul>
    </main>
  );
}

import Link from 'next/link';
import { api } from '@/lib/api';

export default async function ClubsPage() {
  let clubs: Awaited<ReturnType<typeof api.listClubs>> = [];
  let error: string | null = null;
  try {
    clubs = await api.listClubs();
  } catch (e) {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Your Clubs</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-gray-200">
        {clubs.map((club) => (
          <li key={club.id} className="py-4">
            <Link href={`/clubs/${club.id}/events`} className="font-medium hover:underline">
              {club.name}
            </Link>
            <p className="text-sm text-gray-500">{club.description}</p>
            <p className="text-xs text-gray-400">Join code: {club.joinCode}</p>
          </li>
        ))}
        {!error && clubs.length === 0 && (
          <li className="py-4 text-sm text-gray-500">No clubs yet. Create one from the mobile app or POST /api/v1/clubs.</li>
        )}
      </ul>
    </main>
  );
}

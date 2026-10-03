import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-start gap-4 p-8">
      <h1 className="text-2xl font-semibold">Pickleball Club Organizer Dashboard</h1>
      <p className="text-gray-600">
        Web dashboard for club organizers — manage clubs, events, and reports from a browser.
        See the project&apos;s Technical Architecture doc for the full feature set.
      </p>
      <Link href="/clubs" className="rounded bg-black px-4 py-2 text-white">
        View your clubs
      </Link>
    </main>
  );
}

import Link from 'next/link';
import { api } from '@/lib/api';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function ClubsPage() {
  let clubs: Awaited<ReturnType<typeof api.listClubs>> = [];
  let error: string | null = null;
  try {
    clubs = await api.listClubs();
  } catch {
    error = 'Could not reach the API yet — start apps/api and make sure DATABASE_URL is set.';
  }

  return (
    <Page width="lg">
      <PageHeader
        title="Your clubs"
        subtitle="Every club you organize, in one place."
        actions={<LinkButton href="/clubs/new">+ Create club</LinkButton>}
      />
      {error && <Notice>{error}</Notice>}
      {!error && clubs.length === 0 && (
        <EmptyState
          title="No clubs yet"
          action={<LinkButton href="/clubs/new">Create your first club</LinkButton>}
        >
          Set your organizer name and email at the top of the page, then create a club.
        </EmptyState>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <li key={club.id}>
            <Link href={`/clubs/${club.id}`} className="block h-full rounded-2xl">
              <Card interactive className="h-full">
                <h2 className="font-display text-xl font-semibold">{club.name}</h2>
                {club.description && (
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{club.description}</p>
                )}
                <div className="mt-4">
                  <Badge tone="sun">Join code: {club.joinCode}</Badge>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}

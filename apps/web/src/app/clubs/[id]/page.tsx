import Link from 'next/link';
import { api } from '@/lib/api';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

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
      <Page>
        <Notice>{error ?? 'Club not found.'}</Notice>
        <Link href="/clubs" className="inline-flex min-h-11 items-center text-sm text-sun underline">
          ← Back to clubs
        </Link>
      </Page>
    );
  }

  return (
    <Page>
      <Link href="/clubs" className="mb-4 inline-flex min-h-11 items-center text-sm text-muted hover:text-ink">
        ← All clubs
      </Link>
      <PageHeader
        title={club.name}
        subtitle={
          <>
            {club.description && <p className="mb-2 text-base">{club.description}</p>}
            <Badge tone="sun">Join code: {club.joinCode}</Badge>
          </>
        }
        actions={
          <>
            <LinkButton href={`/clubs/${id}/events`} variant="secondary">
              View events
            </LinkButton>
            <LinkButton href={`/clubs/${id}/events/new`}>+ Create event</LinkButton>
          </>
        }
      />

      <h2 className="mb-3 font-display text-xl font-semibold">Members ({club.members.length})</h2>
      {club.members.length === 0 ? (
        <EmptyState title="No members yet">Share the join code so players can find your club.</EmptyState>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-line">
            {club.members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="font-medium">{m.user?.fullName ?? m.reserveName ?? 'Unknown'}</span>
                <Badge tone={m.role === 'owner' ? 'sun' : m.role === 'cohost' ? 'leaf' : 'neutral'}>
                  {m.role}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}

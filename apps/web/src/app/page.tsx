import { LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Page } from '@/components/ui/Page';

const features = [
  { icon: '📅', title: 'Schedule events', text: 'Set the venue, courts and player cap in a minute.' },
  { icon: '✅', title: 'Manage RSVPs', text: 'Approve, waitlist, check in and track payments.' },
  { icon: '🏆', title: 'Run round robins', text: 'Generate matches, enter scores, see live standings.' },
];

export default function Home() {
  return (
    <Page width="lg">
      <section className="py-10 sm:py-16">
        <p className="mb-4 inline-block rounded-full bg-sun px-3 py-1 text-xs font-bold uppercase tracking-wide text-canvas">
          Organizer dashboard
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Run your pickleball club like a <span className="text-brand">pro</span>.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Manage clubs, events and round robins from the browser — everything your players see in
          the app, under your control.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/clubs">View your clubs</LinkButton>
          <LinkButton href="/clubs/new" variant="secondary">
            Create a club
          </LinkButton>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <div aria-hidden className="mb-3 text-2xl">
              {f.icon}
            </div>
            <h2 className="font-display text-lg font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </Card>
        ))}
      </section>
    </Page>
  );
}

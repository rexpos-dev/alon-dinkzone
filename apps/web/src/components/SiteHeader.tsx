import Link from 'next/link';
import CurrentUserBadge from './CurrentUserBadge';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-lg font-bold">
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-brand text-base"
            >
              🏓
            </span>
            <span>
              Dink<span className="text-sun">Zone</span>
            </span>
          </Link>
          <nav aria-label="Main">
            <Link
              href="/clubs"
              className="inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-leaf/40 hover:text-ink"
            >
              Clubs
            </Link>
          </nav>
        </div>
        <CurrentUserBadge />
      </div>
    </header>
  );
}

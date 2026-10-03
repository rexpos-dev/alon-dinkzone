import type { ReactNode } from 'react';

export function Notice({ tone = 'error', children }: { tone?: 'error' | 'info'; children: ReactNode }) {
  const styles =
    tone === 'error'
      ? 'border-danger/40 bg-danger/10 text-danger'
      : 'border-sun/40 bg-sun/10 text-sun';
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </p>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-raised ${className}`} />;
}

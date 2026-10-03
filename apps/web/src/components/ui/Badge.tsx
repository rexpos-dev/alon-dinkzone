import type { ReactNode } from 'react';

type Tone = 'sun' | 'lime' | 'leaf' | 'neutral' | 'danger';

const tones: Record<Tone, string> = {
  sun: 'bg-sun text-canvas',
  lime: 'bg-lime text-canvas',
  leaf: 'bg-leaf text-ink',
  neutral: 'border border-line bg-raised text-muted',
  danger: 'bg-danger/15 text-danger',
};

export function Badge({
  tone = 'neutral',
  className = '',
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

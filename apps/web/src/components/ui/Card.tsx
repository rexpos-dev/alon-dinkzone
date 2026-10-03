import type { HTMLAttributes } from 'react';

export function Card({
  interactive = false,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  const hover = interactive
    ? 'transition motion-safe:hover:-translate-y-0.5 hover:border-leaf hover:bg-raised'
    : '';
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-5 ${hover} ${className}`}
      {...props}
    />
  );
}

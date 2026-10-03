import type { ReactNode } from 'react';

const widths = { sm: 'max-w-lg', md: 'max-w-3xl', lg: 'max-w-5xl' } as const;

export function Page({ width = 'md', children }: { width?: keyof typeof widths; children: ReactNode }) {
  return <main className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-12 ${widths[width]}`}>{children}</main>;
}

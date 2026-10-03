import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-canvas hover:bg-brand-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-raised',
  ghost: 'text-muted hover:bg-leaf/40 hover:text-ink',
  danger: 'border border-danger/40 text-danger hover:bg-danger/10',
};
const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-sm',
  sm: 'min-h-11 px-3 text-xs',
};

export function buttonClass({ variant = 'primary', size = 'md' }: { variant?: Variant; size?: Size } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export function Button({
  variant,
  size,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={`${buttonClass({ variant, size })} ${className}`} {...props} />;
}

export function LinkButton({
  variant,
  size,
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={`${buttonClass({ variant, size })} ${className}`} {...props} />;
}

'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface StatBoxProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: '',
  success: '[color:var(--success)]',
  error: 'text-destructive',
  warning: '[color:var(--classification-inaccuracy)]',
  primary: 'text-primary'
} as const;

const sizeStyles = {
  sm: { value: 'text-lg', label: 'text-xs' },
  md: { value: 'text-2xl', label: 'text-xs' },
  lg: { value: 'text-4xl', label: 'text-sm' }
} as const;

export function StatBox({
  label,
  value,
  sublabel,
  icon,
  variant = 'default',
  size = 'md',
  className
}: StatBoxProps) {
  return (
    <div className={cn('text-center', className)}>
      {icon && <div className='mb-1 flex justify-center'>{icon}</div>}
      <p
        className={cn(
          'font-bold tabular-nums',
          sizeStyles[size].value,
          variantStyles[variant]
        )}
      >
        {value}
      </p>
      <p className={cn('text-muted-foreground', sizeStyles[size].label)}>
        {label}
      </p>
      {sublabel && <p className='text-muted-foreground text-xs'>{sublabel}</p>}
    </div>
  );
}

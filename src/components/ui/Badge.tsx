import React from 'react';
import { cn } from '../../utils';
import { STATUS_CONFIG } from '../../constants';
import { StatusPermohonan } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'purple'
    | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-600',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

// Status Badge Component - khusus untuk status permohonan
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusPermohonan;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, size = 'md', className, ...props }, ref) => {
    const config = STATUS_CONFIG[status];

    const statusVariants: Record<StatusPermohonan, string> = {
      diajukan: 'bg-yellow-100 text-yellow-800',
      diverifikasi: 'bg-blue-100 text-blue-800',
      diproses: 'bg-purple-100 text-purple-800',
      selesai: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          statusVariants[status],
          sizes[size],
          className
        )}
        {...props}
      >
        {config.label}
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
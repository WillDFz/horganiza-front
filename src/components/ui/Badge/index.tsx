import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import type { BadgeVariant } from '@/styles/tokens';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    brand: 'bg-primary-900 text-primary',
    success: 'bg-success-subtle text-success',
    warning: 'bg-warning-subtle text-secondary-dark',
    error: 'bg-error-subtle text-error',
    info: 'bg-info-subtle text-info',
    neutral: 'bg-white-400 text-muted-foreground',
};

const Badge = ({ variant = 'neutral', className, children, ...props }: BadgeProps) => {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold leading-5',
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;

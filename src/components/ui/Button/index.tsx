'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { CircularProgress } from '@mui/material';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed',
    secondary:
        'bg-white-500 text-foreground hover:bg-white-400 border border-border disabled:opacity-60 disabled:cursor-not-allowed',
    ghost:
        'bg-transparent text-primary hover:bg-primary-50 disabled:opacity-60 disabled:cursor-not-allowed',
    destructive:
        'bg-error text-white hover:bg-error/90 disabled:opacity-60 disabled:cursor-not-allowed',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
};

const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className,
    children,
    disabled,
    type = 'button',
    ...props
}: ButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {loading ? <CircularProgress size={16} color="inherit" /> : icon}
            {children}
        </button>
    );
};

export default Button;

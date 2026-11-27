import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: CardPadding;
    children: ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
    sm: 'p-4',
    md: 'p-4 md:p-6',
    lg: 'p-8',
};

const Card = ({ padding = 'md', className, children, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                'bg-surface rounded-lg shadow-md',
                paddingClasses[padding],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;

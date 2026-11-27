import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

const EmptyState = ({ title, description, action, className }: EmptyStateProps) => {
    return (
        <div className={cn('py-12 text-center', className)}>
            <p className="font-medium text-muted-foreground">{title}</p>
            {description ? (
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
            ) : null}
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
};

export default EmptyState;

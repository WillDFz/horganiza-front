import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}

const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
    return (
        <div className={cn('flex flex-col gap-4 mb-4 sm:flex-row sm:items-start sm:justify-between', className)}>
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
    );
};

export default PageHeader;

import { CircularProgress } from '@mui/material';
import { cn } from '@/lib/cn';

type LoadingPadding = 'sm' | 'md' | 'lg';

interface LoadingStateProps {
    padding?: LoadingPadding;
    className?: string;
}

const paddingClasses: Record<LoadingPadding, string> = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
};

const LoadingState = ({ padding = 'md', className }: LoadingStateProps) => {
    return (
        <div className={cn('flex items-center justify-center', paddingClasses[padding], className)}>
            <CircularProgress />
        </div>
    );
};

export default LoadingState;

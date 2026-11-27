'use client';
import { useAuth } from '@/contexts/auth-context';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, sessionChecking, refreshBusinessSession } = useAuth();
    const router = useRouter();

    useEffect(() => {
        void refreshBusinessSession();
    }, [refreshBusinessSession]);

    useEffect(() => {
        if (sessionChecking) return;
        if (!isAuthenticated) {
            router.replace('/auth/login');
        }
    }, [isAuthenticated, sessionChecking, router]);

    if (sessionChecking) {
        return (
            <div className="flex min-h-[40vh] w-full items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default RouteGuard;

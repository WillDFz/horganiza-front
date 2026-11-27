'use client';
import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';


interface CustomerRouteGuardProps {
    business_slug: string;
    children: React.ReactNode;
}

const CustomerRouteGuard = ({ children, business_slug }: CustomerRouteGuardProps) => {
    const { isAuthenticated, sessionChecking, refreshCustomerSession } = useAuth();
    const router = useRouter();

    useEffect(() => {
        void refreshCustomerSession();
    }, [refreshCustomerSession]);

    useEffect(() => {
        if (sessionChecking) return;
        if (!isAuthenticated) {
            router.replace(`/business/${business_slug}/auth/login`);
        }
    }, [sessionChecking, isAuthenticated, router, business_slug]);

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
}

export default CustomerRouteGuard

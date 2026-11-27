'use client';

import { Alert, CircularProgress, Link } from '@mui/material';
import React from 'react';
import { BusinessInfo } from '@/types/api/business.types';
import BusinessLogo from '../BusinessLogo';

interface CustomerAuthFormShellProps {
    loading: boolean;
    error: string | null;
    businessInfo: BusinessInfo | null;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    footerLink: { href: string; label: string };
    children: React.ReactNode;
}

const CustomerAuthFormShell: React.FC<CustomerAuthFormShellProps> = ({
    loading,
    error,
    businessInfo,
    onSubmit,
    footerLink,
    children,
}) => {
    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <div>
            <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                <div className="mb-4 flex flex-col items-center justify-center gap-2">
                    <BusinessLogo logo={businessInfo?.logo} />
                    <h1 className="text-2xl font-bold">{businessInfo?.name}</h1>
                </div>
                {children}
            </form>
            <div className="mt-4 flex items-center justify-center">
                <Link href={footerLink.href}>{footerLink.label}</Link>
            </div>
        </div>
    );
};

export default CustomerAuthFormShell;

'use client';

import React from 'react';

interface CustomerAuthCardProps {
    children: React.ReactNode;
}

const CustomerAuthCard: React.FC<CustomerAuthCardProps> = ({ children }) => (
    <div className="w-full max-w-xs xl:max-w-sm rounded-lg bg-white p-8 shadow-md">
        <div className="mb-4 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Logo" className="w-40 object-contain" />
        </div>
        {children}
    </div>
);

export default CustomerAuthCard;

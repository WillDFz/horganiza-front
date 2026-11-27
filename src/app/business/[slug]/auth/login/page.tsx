'use client';
import React from 'react'
import CustomerLoginForm from '@/components/auth/Customer/Login';
import { useParams } from 'next/navigation';

const CustomerLoginPage = () => {

    const { slug } = useParams();
    

    return (
        <div className="w-full min-h-screen bg-linear-to-br from-primary-100 via-primary-300 to-secondary-200 flex justify-center items-center py-8 px-4 relative overflow-hidden">
            <CustomerLoginForm business_slug={slug as string} />
        </div>
    )
};

export default CustomerLoginPage;

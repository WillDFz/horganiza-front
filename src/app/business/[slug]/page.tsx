'use client';

import { useParams } from 'next/navigation';
import BusinessPageContent from '@/components/features/business/BusinessPageContent';
import CustomerLayout from '@/components/layout/CustomerLayout';

const BusinessPage = () => {
    const { slug } = useParams();
    const businessSlug = typeof slug === 'string' ? slug : '';

    if (!businessSlug) {
        return null;
    }

    return (
        <CustomerLayout business_slug={businessSlug}>
            <BusinessPageContent slug={businessSlug} />
        </CustomerLayout>
    );
};

export default BusinessPage;

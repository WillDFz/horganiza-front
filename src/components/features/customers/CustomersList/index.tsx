'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomer } from '@/hooks/useCustomer';
import { useBusiness } from '@/hooks/useBusiness';
import { Customer } from '@/types/api/customer.types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import PageHeader from '@/components/ui/PageHeader';
import CustomerTable from './CustomerTable';

const CustomersList = () => {
    const { getCustomers, loading } = useCustomer();
    const { getBusiness, business } = useBusiness();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        void getBusiness();
    }, [getBusiness]);

    useEffect(() => {
        let isMounted = true;

        const loadCustomers = async () => {
            try {
                const data = await getCustomers();
                if (isMounted) {
                    setCustomers(data);
                }
            } catch {
                if (isMounted) {
                    setCustomers([]);
                }
            } finally {
                if (isMounted) {
                    setIsInitialLoading(false);
                }
            }
        };

        void loadCustomers();

        return () => {
            isMounted = false;
        };
    }, [getCustomers]);

    const businessPublicUrl =
        business?.url?.trim()
            ? `/business/${business.url}`
            : null;

    const renderCustomersContent = () => {
        if (loading || isInitialLoading) {
            return <LoadingState />;
        }

        if (customers.length === 0) {
            return (
                <EmptyState
                    title="Nenhum cliente cadastrado"
                    description="Compartilhe o link público do seu negócio para que clientes possam se cadastrar e agendar."
                    action={
                        businessPublicUrl ? (
                            <Link href={businessPublicUrl} target="_blank" rel="noopener noreferrer">
                                <Button>Ver página do negócio</Button>
                            </Link>
                        ) : undefined
                    }
                />
            );
        }

        return <CustomerTable customers={customers} />;
    };

    return (
        <div>
            <PageHeader title="Clientes" />
            <Card>{renderCustomersContent()}</Card>
        </div>
    );
};

export default CustomersList;

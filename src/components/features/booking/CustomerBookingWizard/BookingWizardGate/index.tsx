'use client';

import type { ReactNode } from 'react';
import { CircularProgress } from '@mui/material';

import type { CustomerBookingWizardState } from '@/hooks/useCustomerBookingWizard';

interface BookingWizardGateProps {
    wizard: CustomerBookingWizardState;
    children: ReactNode;
}

function EmptyMessage({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-custom-black-600">
            {children}
        </p>
    );
}

export function BookingWizardGate({ wizard, children }: Readonly<BookingWizardGateProps>) {
    if (wizard.loading) {
        return (
            <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-gray-200 bg-white">
                <CircularProgress />
            </div>
        );
    }

    if (!wizard.business) {
        return <EmptyMessage>Não foi possível carregar o negócio.</EmptyMessage>;
    }

    if (wizard.services.length === 0) {
        return <EmptyMessage>Nenhum serviço disponível para agendamento.</EmptyMessage>;
    }

    if (wizard.staffMembers.length === 0) {
        return (
            <EmptyMessage>
                Nenhum profissional cadastrado. Entre em contato com o estabelecimento.
            </EmptyMessage>
        );
    }

    return <>{children}</>;
}

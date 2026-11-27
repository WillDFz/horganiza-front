'use client';

import { BookingWizardGate } from './BookingWizardGate';
import { CustomerBookingWizardContent } from './CustomerBookingWizardContent';
import { useCustomerBookingWizard } from '@/hooks/useCustomerBookingWizard';

import type { CustomerBookingWizardProps } from '@/types/booking';

export function CustomerBookingWizard({ business, onBooked }: Readonly<CustomerBookingWizardProps>) {
    const wizard = useCustomerBookingWizard({ business, onBooked });

    return (
        <BookingWizardGate wizard={wizard}>
            <CustomerBookingWizardContent wizard={wizard} />
        </BookingWizardGate>
    );
}

export default CustomerBookingWizard;

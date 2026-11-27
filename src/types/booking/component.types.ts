import type { ReactNode } from 'react';

import type { Service } from '@/types/api/services.types';

import type { BookingDaySlots, BookingSummaryLine } from './booking.types';

export interface InstructionPanelProps {
    accentColor: string;
    icon: ReactNode;
    title: string;
    body: string;
    supportPhone?: string;
}

export interface SummaryPanelProps {
    accentColor: string;
    primary: Service | null;
    extras: Service[];
    lineItems: BookingSummaryLine[];
    totalPrice: number;
    bookingDate: Date | null;
    customerTime: string;
}

export interface BookingTimeSlotsSectionProps {
    accentColor: string;
    daySlots: BookingDaySlots;
    customerTime: string;
    onSelectTime: (time: string) => void;
}

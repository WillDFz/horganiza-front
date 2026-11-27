import type { Business } from '@/types/api/business.types';
import type { AvailableScheduleSlot } from '@/types/api/staff.types';

export type BookingWizardStep = 'service' | 'extras' | 'datetime' | 'customer';

export interface BookingSummaryLine {
    id: string;
    label: string;
    price: number;
}

export interface BookingDaySlots {
    isDayActive: boolean;
    availableSlots: AvailableScheduleSlot[];
    displayRange: string | null;
    serviceExceedsWindow: boolean;
}

export interface CustomerBookingWizardProps {
    business: Business | null;
    onBooked?: () => void;
}

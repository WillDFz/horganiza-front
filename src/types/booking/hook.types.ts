import type { Dispatch, SetStateAction } from 'react';

import type { BookingDaySlots } from './booking.types';

import type { Business } from '@/types/api/business.types';
import type { Service } from '@/types/api/services.types';
import type { StaffMember } from '@/types/api/staff.types';

export interface UseCustomerBookingWizardOptions {
    business: Business | null;
    onBooked?: () => void;
}

export interface UseBookingNavigationOptions {
    primaryServiceId: string | null;
    bookingDate: Date | null;
    customerTime: string;
    daySlots: BookingDaySlots;
    setExtraIds: Dispatch<SetStateAction<string[]>>;
    setPrimaryServiceId: Dispatch<SetStateAction<string | null>>;
    setBookingDate: Dispatch<SetStateAction<Date | null>>;
    setCustomerTime: Dispatch<SetStateAction<string>>;
    setCalendarMonth: Dispatch<SetStateAction<Date>>;
}

export type CreateBookingAppointmentFn = (appointment: {
    id: string;
    business_id: string;
    staff_member_id: string;
    customer_id: string;
    service_id: string;
    status: 'SCHEDULED';
    schedule_time: string;
    customer_name: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}) => Promise<unknown>;

export interface UseBookingSubmitOptions {
    business: Business | null;
    primary: Service | null;
    selectedStaff: StaffMember | null;
    bookingDate: Date | null;
    customerTime: string;
    daySlots: BookingDaySlots;
    firstName: string;
    lastName: string;
    phoneDigits: string;
    extrasSelected: Service[];
    userId: string | undefined;
    createAppointment: CreateBookingAppointmentFn;
    onBooked?: () => void;
    resetWizard: () => void;
}

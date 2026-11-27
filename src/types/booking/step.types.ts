import type { Service } from '@/types/api/services.types';
import type { StaffMember } from '@/types/api/staff.types';

import type { BookingDaySlots } from './booking.types';

export interface ServiceStepProps {
    accentColor: string;
    services: Service[];
    primaryServiceId: string | null;
    onSelectService: (id: string) => void;
    onNext: () => void;
}

export interface ExtrasStepProps {
    accentColor: string;
    services: Service[];
    primaryServiceId: string | null;
    extraIds: string[];
    onToggleExtra: (id: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export interface DateTimeStepProps {
    accentColor: string;
    staffMembers: StaffMember[];
    staffMemberId: string;
    onStaffChange: (id: string) => void;
    calendarMonth: Date;
    onCalendarMonthChange: (d: Date) => void;
    bookingDate: Date | null;
    onSelectDate: (date: Date) => void;
    customerTime: string;
    onSelectTime: (time: string) => void;
    daySlots: BookingDaySlots;
    todayStart: Date;
    dayHasAvailability: (date: Date) => boolean;
    onBack: () => void;
    onNext: () => void;
}

export interface CustomerStepProps {
    accentColor: string;
    firstName: string;
    lastName: string;
    phoneDigits: string;
    onFirstNameChange: (v: string) => void;
    onLastNameChange: (v: string) => void;
    onPhoneDigitsChange: (v: string) => void;
    submitting: boolean;
    onBack: () => void;
}

import { getDayScheduleSlots } from '@/utils/staffScheduleSlots';
import { scheduleTimeToInput } from '@/utils/formatters/scheduleTime';
import { isSameLocalDay } from '@/utils/formatters/date';

import { BOOKING_SLOT_STEP_MINUTES } from '../constants';
import type { BookingDaySlots } from '@/types/booking';

import type { AvailableScheduleSlot, StaffMember } from '@/types/api/staff.types';

const EMPTY_DAY_SLOTS: BookingDaySlots = {
    isDayActive: false,
    availableSlots: [],
    displayRange: null,
    serviceExceedsWindow: false,
};

function wallClockMinutes(raw: string): number {
    const hhmm = scheduleTimeToInput(raw);
    const [h = '0', m = '0'] = hhmm.split(':');
    return parseInt(h, 10) * 60 + parseInt(m, 10);
}

export function getScheduleSlotStartTime(slot: AvailableScheduleSlot): string {
    return scheduleTimeToInput(slot.init);
}

export function formatScheduleSlotLabel(slot: AvailableScheduleSlot): string {
    const start = scheduleTimeToInput(slot.init);
    const end = scheduleTimeToInput(slot.end);
    return `${start} – ${end}`;
}

export function isSelectedScheduleSlot(time: string, slots: AvailableScheduleSlot[]): boolean {
    if (!time || slots.length === 0) return false;
    return slots.some((slot) => getScheduleSlotStartTime(slot) === time);
}

export function getStaffDayMeta(
    bookingDate: Date | null,
    selectedStaff: StaffMember | null,
    totalDurationMinutes: number,
): BookingDaySlots {
    if (!bookingDate || !selectedStaff) {
        return EMPTY_DAY_SLOTS;
    }
    const meta = getDayScheduleSlots(selectedStaff.staffMemberWeekDaySchedule, bookingDate, {
        serviceDurationMinutes: totalDurationMinutes,
        slotStepMinutes: BOOKING_SLOT_STEP_MINUTES,
    });
    return {
        isDayActive: meta.isDayActive,
        availableSlots: [],
        displayRange: meta.displayRange,
        serviceExceedsWindow: meta.serviceExceedsWindow,
    };
}

export function buildDaySlotsFromApi(
    apiSlots: AvailableScheduleSlot[],
    staffMeta: BookingDaySlots,
    bookingDate: Date,
): BookingDaySlots {
    const now = new Date();
    const isToday = isSameLocalDay(bookingDate, now);

    const availableSlots = apiSlots.filter((slot) => {
        if (
            Number.isNaN(new Date(slot.init).getTime()) ||
            Number.isNaN(new Date(slot.end).getTime())
        ) {
            return false;
        }

        if (!isToday) return true;

        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const slotEndMinutes = wallClockMinutes(slot.end);
        const slotStartMinutes = wallClockMinutes(slot.init);

        if (slotEndMinutes <= nowMinutes) return false;
        if (slotStartMinutes <= nowMinutes) return false;
        return true;
    });

    return {
        isDayActive: staffMeta.isDayActive,
        availableSlots,
        displayRange: staffMeta.displayRange,
        serviceExceedsWindow: staffMeta.serviceExceedsWindow,
    };
}

export function computeDaySlots(
    bookingDate: Date | null,
    selectedStaff: StaffMember | null,
    totalDurationMinutes: number,
): BookingDaySlots {
    return getStaffDayMeta(bookingDate, selectedStaff, totalDurationMinutes);
}

export function dayHasAvailability(
    date: Date,
    selectedStaff: StaffMember | null,
    totalDurationMinutes: number,
): boolean {
    if (!selectedStaff || totalDurationMinutes <= 0) return false;
    const result = getDayScheduleSlots(selectedStaff.staffMemberWeekDaySchedule, date, {
        serviceDurationMinutes: totalDurationMinutes,
        slotStepMinutes: BOOKING_SLOT_STEP_MINUTES,
    });
    return result.isDayActive && !result.serviceExceedsWindow && result.slotStarts.length > 0;
}

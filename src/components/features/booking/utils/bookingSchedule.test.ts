import {
    formatScheduleSlotLabel,
    getScheduleSlotStartTime,
} from './bookingSchedule';

import type { AvailableScheduleSlot } from '@/types/api/staff.types';

describe('bookingSchedule slot times', () => {
    const slot: AvailableScheduleSlot = {
        init: '2026-06-24T09:00:00.000Z',
        end: '2026-06-24T09:30:00.000Z',
    };

    it('preserva horário da API sem converter fuso', () => {
        expect(getScheduleSlotStartTime(slot)).toBe('09:00');
        expect(formatScheduleSlotLabel(slot)).toBe('09:00 – 09:30');
    });
});

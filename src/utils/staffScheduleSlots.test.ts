import { dateToApiWeekDay, getDayScheduleSlots } from './staffScheduleSlots';
import type { Weekday } from '@/types/api/staff.types';

const opts = (duration: number, step = 15) => ({
    serviceDurationMinutes: duration,
    slotStepMinutes: step,
});

describe('dateToApiWeekDay', () => {
    it('maps Sunday (JS 0) to SUNDAY', () => {
        const d = new Date(2026, 4, 3); // 3 May 2026 = Sunday
        expect(dateToApiWeekDay(d)).toBe('SUNDAY');
    });

    it('maps Monday to MONDAY', () => {
        const d = new Date(2026, 4, 4); // Monday
        expect(dateToApiWeekDay(d)).toBe('MONDAY');
    });
});

describe('getDayScheduleSlots', () => {
    const monday: Weekday = {
        id: '1',
        staff_id: 's',
        week_day: 'MONDAY',
        start_time: '10:12',
        end_time: '11:12',
        is_active: true,
    };

    const inactiveTuesday: Weekday = {
        id: '2',
        staff_id: 's',
        week_day: 'TUESDAY',
        start_time: '09:00',
        end_time: '18:00',
        is_active: false,
    };

    const mondayFull: Weekday = {
        ...monday,
        start_time: '10:00',
        end_time: '12:00',
    };

    it('returns inactive when weekday exists but is_active is false', () => {
        const tuesdayDate = new Date(2026, 4, 5); // terça
        const r = getDayScheduleSlots([inactiveTuesday], tuesdayDate, opts(30));
        expect(r.isDayActive).toBe(false);
        expect(r.slotStarts).toEqual([]);
        expect(r.serviceExceedsWindow).toBe(false);
    });

    it('generates slots with service duration and step 30', () => {
        const mondayDate = new Date(2026, 4, 4);
        const r = getDayScheduleSlots([monday], mondayDate, opts(30, 30));
        expect(r.isDayActive).toBe(true);
        expect(r.displayRange).toBe('10:12 – 11:12');
        expect(r.serviceExceedsWindow).toBe(false);
        expect(r.slotStarts).toEqual(['10:12', '10:42']);
    });

    it('respects service duration so last start still fits before end', () => {
        const mondayDate = new Date(2026, 4, 4);
        const r = getDayScheduleSlots([mondayFull], mondayDate, opts(60, 15));
        expect(r.slotStarts).toEqual(['10:00', '10:15', '10:30', '10:45', '11:00']);
    });

    it('returns empty slots when service duration is zero', () => {
        const mondayDate = new Date(2026, 4, 4);
        const r = getDayScheduleSlots([mondayFull], mondayDate, opts(0, 15));
        expect(r.isDayActive).toBe(true);
        expect(r.slotStarts).toEqual([]);
        expect(r.serviceExceedsWindow).toBe(false);
    });

    it('marks serviceExceedsWindow when service longer than expediente', () => {
        const mondayDate = new Date(2026, 4, 4);
        const r = getDayScheduleSlots([monday], mondayDate, opts(120, 15));
        expect(r.isDayActive).toBe(true);
        expect(r.slotStarts).toEqual([]);
        expect(r.serviceExceedsWindow).toBe(true);
    });

    it('returns empty slots when start >= end but still active', () => {
        const bad: Weekday = { ...monday, start_time: '12:00', end_time: '12:00' };
        const mondayDate = new Date(2026, 4, 4);
        const r = getDayScheduleSlots([bad], mondayDate, opts(30));
        expect(r.isDayActive).toBe(true);
        expect(r.slotStarts).toEqual([]);
        expect(r.serviceExceedsWindow).toBe(false);
    });
});

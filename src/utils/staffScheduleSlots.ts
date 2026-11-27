import type { Weekday } from '@/types/api/staff.types';

const API_WEEKDAYS = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
] as const;

/** Alinha `Date` local com `week_day` da API (`MONDAY`, …). */
export function dateToApiWeekDay(date: Date): string {
    return API_WEEKDAYS[date.getDay()];
}

function parseTimeToMinutes(hm: string): number {
    const trimmed = hm.trim();
    const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
    if (!match) return Number.NaN;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    if (hours > 23 || minutes > 59) return Number.NaN;
    return hours * 60 + minutes;
}

function minutesToTimeString(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export interface GetDayScheduleSlotsOptions {
    /** Duração do serviço em minutos; o atendimento precisa caber: `início + duração <= fim` do expediente. */
    serviceDurationMinutes: number;
    /** Intervalo entre horários candidatos a início (ex.: 15). */
    slotStepMinutes: number;
}

export interface DayScheduleSlotsResult {
    /** Há entrada para esse dia e `is_active === true`. */
    isDayActive: boolean;
    /** Horários de início possíveis (`HH:mm`). */
    slotStarts: string[];
    /** Intervalo de expediente para exibição, ex.: `10:12 – 20:00`. */
    displayRange: string | null;
    /** Serviço mais longo que o expediente do dia (com dia ativo e duração informada). */
    serviceExceedsWindow: boolean;
}

/**
 * Horários alinhados ao expediente do funcionário e à duração do serviço.
 */
export function getDayScheduleSlots(
    weekSchedule: Weekday[] | undefined,
    date: Date,
    options: GetDayScheduleSlotsOptions,
): DayScheduleSlotsResult {
    const { serviceDurationMinutes, slotStepMinutes } = options;
    const weekDay = dateToApiWeekDay(date);
    const entry = weekSchedule?.find((w) => w.week_day === weekDay);
    if (!entry?.is_active) {
        return {
            isDayActive: false,
            slotStarts: [],
            displayRange: null,
            serviceExceedsWindow: false,
        };
    }

    const startM = parseTimeToMinutes(entry.start_time);
    const endM = parseTimeToMinutes(entry.end_time);
    const range = `${entry.start_time} – ${entry.end_time}`;

    if (
        Number.isNaN(startM) ||
        Number.isNaN(endM) ||
        startM >= endM ||
        slotStepMinutes <= 0
    ) {
        return {
            isDayActive: true,
            slotStarts: [],
            displayRange: range,
            serviceExceedsWindow: false,
        };
    }

    if (!Number.isFinite(serviceDurationMinutes) || serviceDurationMinutes <= 0) {
        return {
            isDayActive: true,
            slotStarts: [],
            displayRange: range,
            serviceExceedsWindow: false,
        };
    }

    const windowLen = endM - startM;
    if (serviceDurationMinutes > windowLen) {
        return {
            isDayActive: true,
            slotStarts: [],
            displayRange: range,
            serviceExceedsWindow: true,
        };
    }

    const slotStarts: string[] = [];
    for (let t = startM; t + serviceDurationMinutes <= endM; t += slotStepMinutes) {
        slotStarts.push(minutesToTimeString(t));
    }

    return {
        isDayActive: true,
        slotStarts,
        displayRange: range,
        serviceExceedsWindow: false,
    };
}

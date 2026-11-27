/** Data/hora legível para exibição (ex.: detalhes de agendamento). */
export function formatDateTimeFullPtBr(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(date);
}

const MS_PER_DAY = 86_400_000;

export function startOfLocalDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameLocalDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export interface UpcomingScheduleDisplayPtBr {
    /** Rótulo principal do dia (ex.: Hoje, Amanhã, nome do dia). */
    dayLabel: string;
    /** Horário curto (ex.: 14:30). */
    timeLabel: string;
    /** Texto auxiliar (ex.: Daqui a 3 dias). */
    hint: string | null;
}

/**
 * Partes de interface para listar um agendamento futuro de forma escaneável (cartão / linha).
 * `nowMs` deve ser o mesmo instante usado para filtrar “futuros”, para consistência na UI.
 */
export function formatUpcomingScheduleDisplayPtBr(
    scheduleTime: Date | string,
    nowMs: number,
): UpcomingScheduleDisplayPtBr | null {
    const date = scheduleTime instanceof Date ? scheduleTime : new Date(scheduleTime);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const now = new Date(nowMs);
    const diffDays = Math.round(
        (startOfLocalDay(date).getTime() - startOfLocalDay(now).getTime()) / MS_PER_DAY,
    );

    const timeLabel = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(date);

    if (diffDays === 0) {
        return { dayLabel: 'Hoje', timeLabel, hint: null };
    }
    if (diffDays === 1) {
        return { dayLabel: 'Amanhã', timeLabel, hint: null };
    }

    if (diffDays >= 2 && diffDays <= 6) {
        const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
        const dayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        return {
            dayLabel,
            timeLabel,
            hint: `Daqui a ${diffDays} dias`,
        };
    }

    const thisYear = now.getFullYear();
    const opts: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    };
    if (date.getFullYear() !== thisYear) {
        opts.year = 'numeric';
    }
    const dayLabel = new Intl.DateTimeFormat('pt-BR', opts).format(date);
    return {
        dayLabel: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
        timeLabel,
        hint: null,
    };
}

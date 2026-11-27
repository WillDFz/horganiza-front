/** Intervalo entre candidatos a início de atendimento (minutos). */
export const BOOKING_SLOT_STEP_MINUTES = 15;

export const BOOKING_MONTH_NAMES = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
] as const;

/** Letras dos dias da semana (Dom–Sáb), alinhado ao `Date.getDay()`. */
export const BOOKING_WEEK_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;

export const BOOKING_DEFAULT_ACCENT = '#0d6efd';

export const BOOKING_COLUMN_HEADING =
    'text-sm font-bold uppercase tracking-wide text-custom-black-200';

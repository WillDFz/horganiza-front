import { Appointment } from '@/types/api/appointments.types';

export const BRAND_COLORS = {
    primary: '#f95738',
    primaryLight: '#fcab9c',
    primaryDark: '#953422',
    secondary: '#ffca3a',
    secondaryLight: '#ffdf89',
    secondaryDark: '#997923',
} as const;

export const APPOINTMENT_STATUS_LABEL: Record<Appointment['status'], string> = {
    SCHEDULED: 'Agendado',
    CONFIRMED: 'Confirmado',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
};

export const APPOINTMENT_STATUS_COLORS: Record<Appointment['status'], string> = {
    SCHEDULED: BRAND_COLORS.secondary,
    CONFIRMED: '#2e7d32',
    COMPLETED: '#1565c0',
    CANCELLED: '#c62828',
};

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export const APPOINTMENT_STATUS_BADGE_VARIANT: Record<Appointment['status'], BadgeVariant> = {
    SCHEDULED: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED: 'error',
};

export const ICON_COLOR_MAP: Record<string, string> = {
    primary: 'var(--color-primary)',
    'gray-500': 'var(--color-custom-black-500)',
};

export function resolveIconColor(color: string): string {
    return ICON_COLOR_MAP[color] ?? color;
}

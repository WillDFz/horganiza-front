import { BOOKING_DEFAULT_ACCENT } from '../constants';

export function getBookingAccentColor(primaryColor: string | null | undefined): string {
    const trimmed = primaryColor?.trim() ?? '';
    return /^#[0-9A-Fa-f]{6}$/.test(trimmed) ? trimmed : BOOKING_DEFAULT_ACCENT;
}

import { serviceUnitPrice } from '@/utils/serviceUnitPrice';

import type { BookingSummaryLine } from '@/types/booking';

import type { Service } from '@/types/api/services.types';

export function findPrimaryService(
    services: Service[],
    primaryServiceId: string | null,
): Service | null {
    return services.find((s) => s.id === primaryServiceId) ?? null;
}

export function findExtrasSelected(services: Service[], extraIds: string[]): Service[] {
    return services.filter((s) => extraIds.includes(s.id));
}

export function computeTotalDurationMinutes(
    primary: Service | null,
    extrasSelected: Service[],
): number {
    const primaryDuration = primary?.duration ?? 0;
    const extrasDuration = extrasSelected.reduce((acc, s) => acc + (s.duration ?? 0), 0);
    return primaryDuration + extrasDuration;
}

export function computeTotalPrice(primary: Service | null, extrasSelected: Service[]): number {
    const primaryPrice = primary ? serviceUnitPrice(primary) : 0;
    const extrasPrice = extrasSelected.reduce((acc, s) => acc + serviceUnitPrice(s), 0);
    return primaryPrice + extrasPrice;
}

export function buildBookingLineItems(
    primary: Service | null,
    extrasSelected: Service[],
): BookingSummaryLine[] {
    const rows: BookingSummaryLine[] = [];
    if (primary) {
        rows.push({ id: primary.id, label: primary.name, price: serviceUnitPrice(primary) });
    }
    extrasSelected.forEach((s) => {
        rows.push({ id: s.id, label: s.name, price: serviceUnitPrice(s) });
    });
    return rows;
}

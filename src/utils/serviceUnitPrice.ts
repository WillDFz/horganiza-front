import type { Service } from '@/types/api/services.types';

export function serviceUnitPrice(s: Service): number {
    const promo = s.promotional_price;
    if (promo !== undefined && promo !== null && promo > 0 && Number.isFinite(promo)) {
        return promo;
    }
    return s.price;
}

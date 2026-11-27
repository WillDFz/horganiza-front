import { formatPhoneBR } from '@/utils/formatters/phoneBr';

import type { Service } from '@/types/api/services.types';

export function buildBookingNotes(extrasSelected: Service[], phoneDigits: string): string {
    const extrasNote =
        extrasSelected.length > 0
            ? `Extras: ${extrasSelected.map((s) => s.name).join(', ')}`
            : '';
    const phoneNote = phoneDigits ? `Telefone: +55 ${formatPhoneBR(phoneDigits)}` : '';
    return [extrasNote, phoneNote].filter(Boolean).join('\n');
}

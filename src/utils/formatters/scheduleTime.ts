/** `@db.Time`: resposta da API → valor do `<input type="time">` (`HH:mm`). */
export const scheduleTimeToInput = (raw: string): string => {
    const s = raw.trim();
    const isoMatch = /T(\d{2}):(\d{2})/.exec(s);
    if (isoMatch) return `${isoMatch[1]}:${isoMatch[2]}`;
    const plainMatch = /^(\d{1,2}):(\d{2})/.exec(s);
    if (plainMatch) return `${plainMatch[1].padStart(2, '0')}:${plainMatch[2]}`;
    const d = new Date(s);
    return Number.isNaN(d.getTime())
        ? '00:00'
        : `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};

/**
 * Valor de `<input type="datetime-local">` (`YYYY-MM-DDTHH:mm`) → ISO-8601 completo
 * para `DateTime` no Prisma / APIs que exigem string ISO.
 */
/** ISO-8601 ou `Date` → valor de `<input type="datetime-local">` (`YYYY-MM-DDTHH:mm`). */
export const isoToDatetimeLocal = (raw: Date | string): string => {
    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) {
        return '';
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
};

export const datetimeLocalToIso = (local: string): string => {
    const d = new Date(local);
    if (Number.isNaN(d.getTime())) {
        throw new Error('Data/hora inválida');
    }
    return d.toISOString();
};

/** `Date` no fuso local → `YYYY-MM-DD` (prefixo de `datetime-local`). */
export const localDateToYyyyMmDd = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/** `Date` no fuso local → `HH:mm`. */
export const dateToHhMm = (date: Date): string => {
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${min}`;
};

/** Valor do `<input type="time">` (ou similar) → `HH:mm` para a API persistir como string. */
export const scheduleTimeFromInput = (hhmm: string): string => {
    const [h = '0', m = '0'] = hhmm.split(':');
    const hh = String(Math.min(23, Math.max(0, parseInt(h, 10) || 0))).padStart(2, '0');
    const mm = String(Math.min(59, Math.max(0, parseInt(m, 10) || 0))).padStart(2, '0');
    return `${hh}:${mm}`;
};

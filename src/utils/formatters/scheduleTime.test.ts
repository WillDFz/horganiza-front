import {
  datetimeLocalToIso,
  isoToDatetimeLocal,
  localDateToYyyyMmDd,
  scheduleTimeFromInput,
  scheduleTimeToInput,
} from './scheduleTime';

describe('scheduleTimeToInput', () => {
  it('parses ISO-like fragment with T', () => {
    expect(scheduleTimeToInput('2026-05-06T14:30:00Z')).toBe('14:30');
  });

  it('pads plain HH:mm', () => {
    expect(scheduleTimeToInput('9:05')).toBe('09:05');
  });

  it('falls back to 00:00 for unparseable string', () => {
    expect(scheduleTimeToInput('not-a-time')).toBe('00:00');
  });

  it('uses UTC from Date string when parseable', () => {
    const d = new Date(Date.UTC(2026, 0, 1, 8, 7, 0)).toISOString();
    expect(scheduleTimeToInput(d)).toBe('08:07');
  });

  it('trims whitespace', () => {
    expect(scheduleTimeToInput('  10:15  ')).toBe('10:15');
  });
});

describe('isoToDatetimeLocal', () => {
  it('formats ISO string for datetime-local input', () => {
    expect(isoToDatetimeLocal('2026-05-06T14:30:00.000Z')).toMatch(/^2026-05-06T\d{2}:\d{2}$/);
  });

  it('returns empty string for invalid date', () => {
    expect(isoToDatetimeLocal('invalid')).toBe('');
  });
});

describe('datetimeLocalToIso', () => {
  it('returns ISO string for valid local datetime', () => {
    const iso = datetimeLocalToIso('2026-05-06T14:30');
    expect(iso).toMatch(/2026-05-06T/);
    expect(Number.isNaN(new Date(iso).getTime())).toBe(false);
  });

  it('throws on invalid value', () => {
    expect(() => datetimeLocalToIso('invalid')).toThrow('Data/hora inválida');
  });
});

describe('localDateToYyyyMmDd', () => {
  it('formats local date with zero padding', () => {
    expect(localDateToYyyyMmDd(new Date(2026, 4, 6))).toBe('2026-05-06');
    expect(localDateToYyyyMmDd(new Date(2026, 0, 1))).toBe('2026-01-01');
  });
});

describe('scheduleTimeFromInput', () => {
  it('normalizes hours and minutes', () => {
    expect(scheduleTimeFromInput('9:5')).toBe('09:05');
  });

  it('clamps to 23:59', () => {
    expect(scheduleTimeFromInput('99:99')).toBe('23:59');
  });

  it('handles empty parts as 00', () => {
    expect(scheduleTimeFromInput(':')).toBe('00:00');
  });
});

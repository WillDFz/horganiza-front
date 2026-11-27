import {
  formatDateTimeFullPtBr,
  formatUpcomingScheduleDisplayPtBr,
  isSameLocalDay,
  startOfLocalDay,
} from './date';

describe('formatDateTimeFullPtBr', () => {
  it('formats valid Date', () => {
    const s = formatDateTimeFullPtBr(new Date(2026, 4, 6, 14, 30));
    expect(s).toMatch(/2026|maio|6/);
  });

  it('formats valid ISO string', () => {
    const s = formatDateTimeFullPtBr('2026-05-06T14:30:00');
    expect(s.length).toBeGreaterThan(5);
  });

  it('returns em dash for invalid', () => {
    expect(formatDateTimeFullPtBr('invalid')).toBe('—');
  });
});

describe('startOfLocalDay / isSameLocalDay', () => {
  it('normalizes to midnight local', () => {
    const d = new Date(2026, 3, 15, 14, 30);
    const s = startOfLocalDay(d);
    expect(s.getHours()).toBe(0);
    expect(s.getMinutes()).toBe(0);
  });

  it('compares calendar day', () => {
    const a = new Date(2026, 2, 1, 8, 0);
    const b = new Date(2026, 2, 1, 22, 0);
    expect(isSameLocalDay(a, b)).toBe(true);
    expect(isSameLocalDay(a, new Date(2026, 2, 2))).toBe(false);
  });
});

describe('formatUpcomingScheduleDisplayPtBr', () => {
  const noon = new Date(2026, 4, 6, 12, 0, 0).getTime();

  it('returns null for invalid schedule', () => {
    expect(formatUpcomingScheduleDisplayPtBr('bad', noon)).toBeNull();
  });

  it('labels today', () => {
    const r = formatUpcomingScheduleDisplayPtBr(new Date(2026, 4, 6, 15, 0), noon);
    expect(r?.dayLabel).toBe('Hoje');
    expect(r?.hint).toBeNull();
  });

  it('labels tomorrow', () => {
    const r = formatUpcomingScheduleDisplayPtBr(new Date(2026, 4, 7, 10, 0), noon);
    expect(r?.dayLabel).toBe('Amanhã');
  });

  it('labels within week with hint', () => {
    const r = formatUpcomingScheduleDisplayPtBr(new Date(2026, 4, 9, 10, 0), noon);
    expect(r?.hint).toMatch(/Daqui a \d+ dias/);
    expect(r?.dayLabel.length).toBeGreaterThan(0);
  });

  it('uses short date for far future same year', () => {
    const r = formatUpcomingScheduleDisplayPtBr(new Date(2026, 10, 1, 10, 0), noon);
    expect(r).not.toBeNull();
    expect(r?.hint).toBeNull();
  });

  it('includes year when appointment in different year', () => {
    const r = formatUpcomingScheduleDisplayPtBr(new Date(2027, 0, 15, 10, 0), noon);
    expect(r).not.toBeNull();
    expect(r?.dayLabel).toMatch(/2027/);
  });
});

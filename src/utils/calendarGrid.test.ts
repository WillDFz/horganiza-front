import { calendarGridDays } from './calendarGrid';

describe('calendarGridDays', () => {
  it('returns 42 cells with correct inMonth flags for May 2026', () => {
    const cells = calendarGridDays(new Date(2026, 4, 1));
    expect(cells).toHaveLength(42);
    expect(cells.filter((c) => c.inMonth)).toHaveLength(31);
    expect(cells.some((c) => !c.inMonth)).toBe(true);
  });
});

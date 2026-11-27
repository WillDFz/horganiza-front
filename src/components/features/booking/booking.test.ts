import {
  BOOKING_MONTH_NAMES,
  BOOKING_SLOT_STEP_MINUTES,
  BOOKING_WEEK_LETTERS,
  CustomerBookingWizard,
  calendarGridDays,
  formatPhoneBR,
  serviceUnitPrice,
  useCustomerBookingWizard,
} from './index';

describe('booking feature exports', () => {
  it('exports wizard, hook, constants and utils', () => {
    expect(CustomerBookingWizard).toBeDefined();
    expect(useCustomerBookingWizard).toBeDefined();
    expect(BOOKING_SLOT_STEP_MINUTES).toBeGreaterThan(0);
    expect(BOOKING_MONTH_NAMES.length).toBe(12);
    expect(BOOKING_WEEK_LETTERS.length).toBe(7);
    expect(typeof serviceUnitPrice).toBe('function');
    expect(typeof formatPhoneBR).toBe('function');
    expect(typeof calendarGridDays).toBe('function');
  });
});

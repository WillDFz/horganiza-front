import { formatPhoneBR, MAX_BR_PHONE_DIGITS, stripPhoneDigits } from './phoneBr';

describe('phoneBr', () => {
  it('stripPhoneDigits removes non-digits and caps length', () => {
    expect(stripPhoneDigits('(11) 99999-8888')).toBe('11999998888');
    expect(stripPhoneDigits('0'.repeat(20))).toHaveLength(MAX_BR_PHONE_DIGITS);
  });

  it('formatPhoneBR handles empty and partial', () => {
    expect(formatPhoneBR('')).toBe('');
    expect(formatPhoneBR('1')).toBe('(1');
    expect(formatPhoneBR('11')).toBe('(11');
    expect(formatPhoneBR('1199999')).toBe('(11) 99999');
    expect(formatPhoneBR('11999998888')).toBe('(11) 99999-8888');
  });
});

import {
  formatAmountPtBr,
  formatNumberToBrMoneyInput,
  parseBrMoneyInput,
} from './money';

describe('parseBrMoneyInput', () => {
  it('parses BRL formatted string', () => {
    expect(parseBrMoneyInput('R$ 40,90')).toBe(40.9);
  });

  it('parses thousands with comma decimal', () => {
    expect(parseBrMoneyInput('1.234,56')).toBe(1234.56);
  });

  it('returns NaN for empty', () => {
    expect(parseBrMoneyInput('')).toBeNaN();
  });
});

describe('formatNumberToBrMoneyInput', () => {
  it('returns empty for non-finite', () => {
    expect(formatNumberToBrMoneyInput(Number.NaN)).toBe('');
  });
});

describe('formatAmountPtBr', () => {
  it('formats with two decimals in pt-BR', () => {
    expect(formatAmountPtBr(40.9)).toBe('40,90');
  });
});

export const MAX_BR_PHONE_DIGITS = 11;

export function stripPhoneDigits(input: string): string {
  return input.replace(/\D/g, '').slice(0, MAX_BR_PHONE_DIGITS);
}

export function formatPhoneBR(digits: string): string {
  if (!digits) return '';
  if (digits.length <= 2) {
    return `(${digits}`;
  }
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const prefix = `(${ddd})`;
  if (rest.length <= 5) {
    return `${prefix} ${rest}`;
  }
  return `${prefix} ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

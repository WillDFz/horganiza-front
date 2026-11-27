export function formatNumberToBrMoneyInput(n: number): string {
  if (!Number.isFinite(n)) {
    return '';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n);
}

/** Só a parte numérica com vírgula (ex.: 40.9 → "40,90"), para usar com prefixo R$ no input. */
export function formatAmountPtBr(n: number): string {
  if (!Number.isFinite(n)) {
    return '';
  }
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Aceita "40,90", "1.234,56", "R$ 40,90", etc. */
export function parseBrMoneyInput(raw: string): number {
  let s = raw.trim().replace(/R\$\s*/gi, '').replace(/\s/g, '');
  if (!s) {
    return Number.NaN;
  }
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && hasDot) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    s = s.replace(',', '.');
  }
  const cleaned = s.replace(/[^\d.-]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

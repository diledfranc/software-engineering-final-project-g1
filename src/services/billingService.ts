import Decimal from 'decimal.js';

export interface BillingSummary {
  subtotal: Decimal;
  vat: Decimal;
  total: Decimal;
}

const toDecimal = (value: number): Decimal => {
  if (!Number.isFinite(value)) {
    return new Decimal(0);
  }

  return new Decimal(value);
};

export const calculateTotal = (
  roomRate: number,
  nights: number,
  vatRate: number
): BillingSummary => {
  const safeRate = Decimal.max(toDecimal(roomRate), 0);
  const safeNights = Decimal.max(toDecimal(nights), 0);
  const safeVatRate = Decimal.max(toDecimal(vatRate), 0);

  const subtotal = safeRate.mul(safeNights);
  const vat = subtotal.mul(safeVatRate);
  const total = subtotal.plus(vat);

  return {
    subtotal,
    vat,
    total,
  };
};

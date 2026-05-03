export interface BillingSummary {
  subtotal: number;
  vat: number;
  total: number;
}

const VAT_RATE = 0.07;

export const calculateTotal = (roomRate: number, nights: number): BillingSummary => {
  const subtotal = roomRate * nights;
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return {
    subtotal,
    vat,
    total,
  };
};

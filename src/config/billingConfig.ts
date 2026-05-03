export const getVatRate = (): number => {
  const rawRate = import.meta.env.VITE_VAT_RATE;
  const parsed = Number(rawRate);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
};

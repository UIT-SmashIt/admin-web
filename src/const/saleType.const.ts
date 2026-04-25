export const SaleType = {
  Retail: 'Retail',
  Wholesale: 'Wholesale',
} as const;

export type SaleType = typeof SaleType[keyof typeof SaleType];
const ProductStatus = {
  Available: 'Available',
  Stockout: 'Stockout',
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];
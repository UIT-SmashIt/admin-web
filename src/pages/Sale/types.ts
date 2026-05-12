import type { IProduct, IProductCategory, IProductDetail } from '../../types/product.type';

export type { IProduct, IProductCategory, IProductDetail };

export interface CartItem {
  item: IProduct;
  variant: IProductDetail;
  qty: number;
}

export interface OrderHistory {
  id: number;
  time: string;
  items: { maSP: string; name: string; qty: number; unit: string; price: number }[];
  total: number;
}

export type PaymentMethod = 'cash' | 'qr' | null;
export type View = 'pos' | 'checkout';

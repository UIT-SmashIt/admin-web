// Order / Booking Types

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentMethod = 'CASH' | 'QR' | 'BANK';
export type PaymentStatus = 'unpaid' | 'deposited' | 'paid' | 'cancelled';
export type BookingType = 'single' | 'community';

export interface IOrderService {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface IOrder {
  id: number;
  customerName: string;
  customerCode: string;
  phone: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  services: IOrderService[];
  courtFee: number;
  serviceFee: number;
  deposit: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  type: BookingType;
  createdAt: string;
  updatedAt: string;
  maxPlayers?: number;
  currentPlayers?: number;
  level?: string;
}

export interface OrderAddPayload {
  customerName: string;
  customerCode: string;
  phone: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  services: IOrderService[];
  type: BookingType;
  maxPlayers?: number;
  level?: string;
}

export interface OrderEditPayload extends Partial<OrderAddPayload> {
  // Allow partial updates
}

export interface PaymentCalculatePayload {
  givenAmount: number;
  paymentMethod: PaymentMethod;
}

export interface PaymentCalculateResponse {
  totalBeforeDiscount: number;
  totalDiscount: number;
  totalAmount: number;
  changeAmount: number;
  promotionDescription: string;
}

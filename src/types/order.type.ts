// Order / Booking Types

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'WaitingForPayment';
export type PaymentMethod = 'CASH' | 'QR';
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
  courtOrderId: number;
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

// Admin Order API Types
export interface AdminOrder {
  courtOrderId: number;
  orderDate: string;
  startHour: string;
  endHour: string;
  status: OrderStatus;
  adminId: number;
  customerId: number;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  createdAt: string;
  updatedAt: string;
  courtIds: number[];
}

export interface AdminOrderCreatePayload {
  orderDate: string;
  startHour: string;
  endHour: string;
  courtIds: number[];
}

export interface AdminOrderUpdateService {
  productId: number;
  productCategoryId: number;
  quantity: number;
}

export interface AdminOrderUpdatePayload {
  services: AdminOrderUpdateService[];
}

export interface CourtScheduleSlot {
  startHour: string;
  endHour: string;
  courtId: number;
  orderDate: string;
  courtOrderId: number;
}

export interface CourtScheduleRequest {
  orderDate: string;
}

export type CourtScheduleResponse = Record<string, CourtScheduleSlot[]>;

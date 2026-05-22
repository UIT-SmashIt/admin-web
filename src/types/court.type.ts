export type OrderType = 'daily' | 'fixed';
export type OrderStatus = 'unpaid' | 'deposit' | 'paid';

export interface IOrder {
  id: string;
  name: string;
  court: string;
  type: OrderType;
  status: OrderStatus;
  slots: string[];
  phone: string;
  weekdays?: string;
}

export interface OrderAddPayload {
  name: string;
  court: string;
  type: OrderType;
  status: OrderStatus;
  slots: string[];
  phone: string;
  weekdays?: string;
}

export interface OrderEditPayload {
  name?: string;
  court?: string;
  type?: OrderType;
  status?: OrderStatus;
  slots?: string[];
  phone?: string;
  weekdays?: string;
}

export interface ICourtStatus {
  courtId: string;
  courtName: string;
  totalOrders: number;
  bookedSlots: number;
  availableSlots: number;
  utilizationRate: number;
  unpaidCount: number;
}

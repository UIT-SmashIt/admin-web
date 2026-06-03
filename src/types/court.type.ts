export type OrderType = 'daily' | 'fixed';
export type OrderStatus = 'unpaid' | 'deposit' | 'paid';

export interface ICourt {
  courtId: number;
  numOfIndex: number;
  isMaintenance: boolean;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourtAddPayload {
  numOfIndex: number;
}

export interface CourtEditPayload {
  numOfIndex: number;
}

export interface CourtPriceUpdatePayload {
  newPrice: number;
}

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
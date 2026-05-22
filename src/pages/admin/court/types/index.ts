export type OrderType = 'daily' | 'fixed';
export type OrderStatus = 'unpaid' | 'deposit' | 'paid';

export interface Order {
  id: string;
  name: string;
  court: string;
  type: OrderType;
  status: OrderStatus;
  slots: string[];
  phone: string;
  weekdays?: string;
}

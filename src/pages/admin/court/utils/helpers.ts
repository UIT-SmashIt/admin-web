import type { Order, OrderType, OrderStatus } from '../types';
import { TIMES } from '../consts/times';

export function formatDate(date: Date): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function toInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getBookedMap(court: string, orders: Order[]): Record<string, Order> {
  const map: Record<string, Order> = {};
  orders.filter((o) => o.court === court).forEach((o) => o.slots.forEach((s) => { map[s] = o; }));
  return map;
}

export function getTypeLabel(type: OrderType) {
  return type === 'fixed' ? 'Cố định' : 'Đơn ngày';
}

export function getStatusLabel(status: OrderStatus) {
  if (status === 'unpaid') return 'Chưa thanh toán';
  if (status === 'deposit') return 'Đã cọc';
  return 'Đã thanh toán';
}

import { api } from './apiClient.ts';
import type { IOrder, ICourtStatus, OrderAddPayload, OrderEditPayload } from '../types/court.type.ts';

export const fetchCourts = async (): Promise<ICourtStatus[]> => {
  return api.get<ICourtStatus[]>('/api/court');
};

export const fetchOrders = async (date?: string): Promise<IOrder[]> => {
  const params = date ? `?date=${date}` : '';
  return api.get<IOrder[]>(`/api/court/orders${params}`);
};

export const fetchOrderById = async (id: string): Promise<IOrder> => {
  return api.get<IOrder>(`/api/court/orders/${id}`);
};

export const addOrder = async (newOrder: OrderAddPayload): Promise<IOrder> => {
  return api.post<IOrder>('/api/court/orders', newOrder);
};

export const editOrder = async ({ id, data }: { id: string; data: OrderEditPayload }): Promise<void> => {
  return api.put(`/api/court/orders/${id}`, data);
};

export const updateOrderStatus = async (id: string, status: string): Promise<void> => {
  return api.put(`/api/court/orders/${id}`, { status });
};

export const removeOrder = async (id: string): Promise<void> => {
  return api.delete(`/api/court/orders/${id}`);
};

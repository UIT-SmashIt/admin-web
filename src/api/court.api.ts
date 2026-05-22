import { api } from './apiClient.ts';
import type { ICourt, IOrder, OrderAddPayload, OrderEditPayload, CourtAddPayload, CourtEditPayload } from '../types/court.type.ts';

// ===== Courts API =====
export const fetchCourts = async (): Promise<ICourt[]> => {
  return api.get<ICourt[]>('/api/court');
};

export const fetchCourtById = async (id: number): Promise<ICourt> => {
  return api.get<ICourt>(`/api/court/${id}`);
};

export const addCourt = async (newCourt: CourtAddPayload): Promise<ICourt> => {
  return api.post<ICourt>('/api/court', newCourt);
};

export const editCourt = async ({ id, data }: { id: number; data: CourtEditPayload }): Promise<void> => {
  return api.put(`/api/court/${id}`, data);
};

export const removeCourt = async (id: number): Promise<void> => {
  return api.delete(`/api/court/${id}`);
};

// ===== Orders API =====
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

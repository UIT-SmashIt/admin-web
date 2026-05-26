import { api } from './apiClient.ts';
import type {
  IOrder,
  OrderAddPayload,
  OrderEditPayload,
  PaymentCalculatePayload,
  PaymentCalculateResponse,
  AdminOrder,
  AdminOrderCreatePayload,
  AdminOrderUpdatePayload,
  CourtScheduleRequest,
  CourtScheduleResponse,
} from '../types/order.type.ts';

// ===== Orders API =====
export const fetchOrders = async (): Promise<IOrder[]> => {
  return api.get<IOrder[]>('/api/admin/order');
};

export const fetchOrderById = async (id: number): Promise<IOrder> => {
  return api.get<IOrder>(`/api/admin/order/${id}`);
};

export const addOrder = async (newOrder: OrderAddPayload): Promise<IOrder> => {
  return api.post<IOrder>('/api/admin/order', newOrder);
};

export const editOrder = async ({
  id,
  data,
}: {
  id: number;
  data: OrderEditPayload;
}): Promise<void> => {
  return api.put(`/api/admin/order/${id}`, data);
};

export const removeOrder = async (id: number): Promise<void> => {
  return api.delete(`/api/admin/order/${id}`);
};

export const calculatePayment = async ({
  id,
  payload,
}: {
  id: number;
  payload: PaymentCalculatePayload;
}): Promise<PaymentCalculateResponse> => {
  return api.post<PaymentCalculateResponse>(
    `/api/admin/order/${id}/calculate`,
    payload
  );
};

export const invoiceOrder = async ({
  id,
  payload,
}: {
  id: number;
  payload: PaymentCalculatePayload;
}): Promise<void> => {
  return api.post(`/api/admin/order/${id}/invoice`, payload);
};

export const fetchOrderHistory = async (): Promise<IOrder[]> => {
  return api.get<IOrder[]>('/api/admin/order/history');
};

// ===== Admin Orders API =====
export const fetchAdminOrders = async (): Promise<AdminOrder[]> => {
  return api.get<AdminOrder[]>('/api/admin/order');
};

export const fetchAdminOrderById = async (id: number): Promise<AdminOrder> => {
  return api.get<AdminOrder>(`/api/admin/order/${id}`);
};

export const createAdminOrder = async (
  payload: AdminOrderCreatePayload
): Promise<AdminOrder> => {
  return api.post<AdminOrder>('/api/admin/order', payload);
};

export const updateAdminOrder = async ({
  id,
  payload,
}: {
  id: number;
  payload: AdminOrderUpdatePayload;
}): Promise<void> => {
  return api.put(`/api/admin/order/${id}/update`, payload);
};

export const fetchCourtSchedule = async (
  payload: CourtScheduleRequest
): Promise<CourtScheduleResponse> => {
  return api.post<CourtScheduleResponse>(
    '/api/admin/order/court/schedule',
    payload
  );
};

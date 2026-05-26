import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addOrder,
  calculatePayment,
  editOrder,
  fetchOrderById,
  fetchOrderHistory,
  fetchOrders,
  invoiceOrder,
  removeOrder,
  fetchAdminOrders,
  fetchAdminOrderById,
  createAdminOrder,
  updateAdminOrder,
  fetchCourtSchedule,
} from '../api/order.api.ts';
import type {
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

export const useFetchOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
};

export const useFetchOrderById = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
  });
};

export const useAddOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, OrderAddPayload>({
    mutationFn: addOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useEditOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; data: OrderEditPayload }>({
    mutationFn: editOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useRemoveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: removeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useCalculatePayment = () => {
  return useMutation<
    PaymentCalculateResponse,
    Error,
    { id: number; payload: PaymentCalculatePayload }
  >({
    mutationFn: calculatePayment,
  });
};

export const useInvoiceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: number; payload: PaymentCalculatePayload }
  >({
    mutationFn: invoiceOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};

export const useFetchOrderHistory = () => {
  return useQuery({
    queryKey: ['orderHistory'],
    queryFn: fetchOrderHistory,
  });
};

// ===== Admin Order Hooks =====
export const useFetchAdminOrders = () => {
  return useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAdminOrders,
  });
};

export const useFetchAdminOrderById = (id: number) => {
  return useQuery({
    queryKey: ['adminOrder', id],
    queryFn: () => fetchAdminOrderById(id),
  });
};

export const useCreateAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminOrder, Error, AdminOrderCreatePayload>({
    mutationFn: createAdminOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};

export const useUpdateAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; payload: AdminOrderUpdatePayload }>(
    {
      mutationFn: updateAdminOrder,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      },
    }
  );
};

export const useFetchCourtSchedule = () => {
  return useMutation<CourtScheduleResponse, Error, CourtScheduleRequest>({
    mutationFn: fetchCourtSchedule,
  });
};

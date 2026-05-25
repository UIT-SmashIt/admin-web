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
} from '../api/order.api.ts';
import type {
  OrderAddPayload,
  OrderEditPayload,
  PaymentCalculatePayload,
  PaymentCalculateResponse,
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

  return useMutation<void, Error, number>({
    mutationFn: invoiceOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useFetchOrderHistory = () => {
  return useQuery({
    queryKey: ['orderHistory'],
    queryFn: fetchOrderHistory,
  });
};

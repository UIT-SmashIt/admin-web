import {api} from "./apiClient.ts";
import type {
  IProductOrderHistory,
  IProductOrderInvoiceCalculationResult,
  ProductOrderInvoiceCreatePayload
} from "../types/productOrder.type.ts";

export const fetchProductOrderHistory = async (): Promise<IProductOrderHistory[]> => {
  return api.get<IProductOrderHistory[]>('api/admin/order/product/history');
}

export const calculateProductOrderInvoice = async (payload: ProductOrderInvoiceCreatePayload): Promise<IProductOrderInvoiceCalculationResult> => {
  return api.post<IProductOrderInvoiceCalculationResult>('/api/admin/order/product/invoice/calculate', payload);
}

export const addProductOrderInvoice = async (payload: ProductOrderInvoiceCreatePayload): Promise<void> => {
  return api.post('/api/admin/order/product/invoice', payload);
}
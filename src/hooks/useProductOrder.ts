import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  addProductOrderInvoice,
  calculateProductOrderInvoice,
  fetchProductOrderHistory
} from "../api/productOrder.api.ts";
import type {
  IProductOrderInvoiceCalculationResult,
  ProductOrderInvoiceCreatePayload
} from "../types/productOrder.type.ts";

export const useFetchProductOrderHistory = () => {
  return useQuery({
    queryKey: ['productOrderHistories'],
    queryFn: fetchProductOrderHistory
  });
}

export const useCalculateProductOrderInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<IProductOrderInvoiceCalculationResult, Error, ProductOrderInvoiceCreatePayload>({
    mutationFn: calculateProductOrderInvoice,
    /*onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
    },*/
  });
}

export const useAddProductOrderInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductOrderInvoiceCreatePayload>({
    mutationFn: addProductOrderInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productOrderHistories']});
    }
  });
}
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addProduct, editProduct, fetchProducts} from "../api/productApi.ts";
import type {
  ProductAddPayload,
  ProductEditPayload,
} from "../types/product.type.ts";

export const useFetchProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
}

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductAddPayload>({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });
}

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {id: number, data: ProductEditPayload}>({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });
}
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addProduct, fetchProducts} from "../api/productApi.ts";
import type {ProductCreatePayload} from "../types/product.type.ts";

export const useFetchProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
}

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductCreatePayload>({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });
}
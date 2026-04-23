import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createProductCategory, fetchProductCategory, updateProductCategory} from "../api/productCategoryApi.ts";
import type {ProductCategoryReq} from "../types/productCategory.type.ts";

export const useFetchProductCategory = () => {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: fetchProductCategory
  });
}

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductCategoryReq>({
    mutationFn: createProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productCategories']});
    },
  });
}

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {id: string, data: ProductCategoryReq}>({
    mutationFn: updateProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productCategories']});
    },
  });
}
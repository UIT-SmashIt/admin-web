import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addProductCategory, editProductCategory, fetchProductCategories} from "../api/productCategoryApi.ts";
import type {ProductCategoryReq} from "../types/productCategory.type.ts";

export const useFetchProductCategories = () => {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: fetchProductCategories
  });
}

export const useAddProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductCategoryReq>({
    mutationFn: addProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productCategories']});
    },
  });
}

export const useEditProductCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {id: number, data: ProductCategoryReq}>({
    mutationFn: editProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productCategories']});
    },
  });
}
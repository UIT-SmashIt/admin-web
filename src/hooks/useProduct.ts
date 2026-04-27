import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addProduct, addProductImport, editProduct, fetchProductImports, fetchProducts} from "../api/productApi.ts";
import type {
  ProductAddPayload,
  ProductEditPayload, ProductImportAddPayload,
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

export const useFetchProductImports = () => {
  return useQuery({
    queryKey: ['productImports'],
    queryFn: fetchProductImports
  });
}

export const useAddProductImport = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ProductImportAddPayload>({
    mutationFn: addProductImport,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['productImports']});
    },
  });
}
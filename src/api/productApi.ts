import {api} from "./apiClient.ts";
import type {
  IProduct,
  IProductImport,
  ProductAddPayload,
  ProductEditPayload,
  ProductImportAddPayload
} from "../types/product.type.ts";

export const fetchProducts = async (): Promise<IProduct[]> => {
  return api.get<IProduct[]>('api/product');
}

export const addProduct = async (newProduct: ProductAddPayload): Promise<void> => {
  return api.post('/api/product', newProduct);
}

export const editProduct = async ({id, data}: {id: number, data: ProductEditPayload}): Promise<void> => {
  return api.put(`/api/product/${id}`, data);
}

export const fetchProductImports = async (): Promise<IProductImport[]> => {
  return api.get<IProductImport[]>('api/product-import');
}

export const addProductImport = async (newImport: ProductImportAddPayload): Promise<void> => {
  return api.post('/api/product-import', newImport);
}
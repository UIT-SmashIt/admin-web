import {api} from "./apiClient.ts";
import type {
  IProduct, IProductCategory,
  IProductImport,
  ProductAddPayload, ProductCategoryPayload,
  ProductEditPayload, ProductEditQuantityPayload,
  ProductImportAddPayload
} from "../types/product.type.ts";

export const fetchProducts = async (): Promise<IProduct[]> => {
  return api.get<IProduct[]>('api/admin/product');
}

export const addProduct = async (newProduct: ProductAddPayload): Promise<void> => {
  return api.post('/api/admin/product', newProduct);
}

export const editProduct = async ({id, data}: {id: number, data: ProductEditPayload}): Promise<void> => {
  return api.put(`/api/admin/product/${id}`, data);
}

export const editProductQuantity = async ({id, data}: {id: number, data: ProductEditQuantityPayload}): Promise<void> => {
  return api.put(`/api/admin/product/${id}/quantity`, data);
}

export const fetchProductImports = async (): Promise<IProductImport[]> => {
  return api.get<IProductImport[]>('api/admin/product/import');
}

export const addProductImport = async (newImport: ProductImportAddPayload): Promise<void> => {
  return api.post('/api/admin/product/import', newImport);
}

export const fetchProductCategories = async (): Promise<IProductCategory[]> => {
  return api.get<IProductCategory[]>('api/admin/product/category');
}

export const addProductCategory = async (newCategory: ProductCategoryPayload): Promise<void> => {
  return api.post('/api/admin/product/category', newCategory);
}

export const editProductCategory = async ({id, data}: {id: number, data: ProductCategoryPayload}): Promise<void> => {
  return api.put(`/api/admin/product/category/${id}`, data);
}
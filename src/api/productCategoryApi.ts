import type {ProductCategoryReq, IProductCategory} from "../types/productCategory.type.ts";
import {api} from "./apiClient.ts";

export const fetchProductCategory = async (): Promise<IProductCategory[]> => {
  return api.get<IProductCategory[]>('api/product-category');
}

export const createProductCategory = async (newCategory: ProductCategoryReq): Promise<void> => {
  return api.post('/api/product-category', newCategory);
}

export const updateProductCategory = async ({id, data}: {id: string, data: ProductCategoryReq}): Promise<void> => {
  return api.put(`/api/product-category/${id}`, data);
}
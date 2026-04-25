import type {ProductCategoryReq, IProductCategory} from "../types/productCategory.type.ts";
import {api} from "./apiClient.ts";

export const fetchProductCategories = async (): Promise<IProductCategory[]> => {
  return api.get<IProductCategory[]>('api/product-category');
}

export const addProductCategory = async (newCategory: ProductCategoryReq): Promise<void> => {
  return api.post('/api/product-category', newCategory);
}

export const editProductCategory = async ({id, data}: {id: number, data: ProductCategoryReq}): Promise<void> => {
  return api.put(`/api/product-category/${id}`, data);
}
import {api} from "./apiClient.ts";
import type {IProduct, ProductCreatePayload} from "../types/product.type.ts";

export const fetchProducts = async (): Promise<IProduct[]> => {
  return api.get<IProduct[]>('api/product');
}

export const addProduct = async (newProduct: ProductCreatePayload): Promise<void> => {
  return api.post('/api/product', newProduct);
}
import { api } from "./apiClient.ts";
import type {
  IPromotion,
  PromotionAddPayload,
  PromotionEditPayload,
} from "../types/promotion.type.ts";

export const fetchPromotions = async (): Promise<IPromotion[]> => {
  return api.get<IPromotion[]>('/api/admin/promotion');
};

export const addPromotion = async (newPromotion: PromotionAddPayload): Promise<void> => {
  return api.post('/api/admin/promotion', newPromotion);
};

export const editPromotion = async ({ id, data }: { id: number; data: PromotionEditPayload }): Promise<void> => {
  return api.put(`/api/admin/promotion/${id}`, data);
};

export const deletePromotion = async (id: number): Promise<void> => {
  return api.delete(`/api/admin/promotion/${id}`);
};

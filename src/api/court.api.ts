import { api } from './apiClient.ts';
import type { ICourt, CourtAddPayload, CourtEditPayload, CourtPriceUpdatePayload } from '../types/court.type.ts';

// ===== Admin Courts API =====
export const fetchCourts = async (): Promise<ICourt[]> => {
  return api.get<ICourt[]>('/api/admin/court');
};

export const fetchCourtById = async (id: number): Promise<ICourt> => {
  return api.get<ICourt>(`/api/admin/court/${id}`);
};

export const addCourt = async (newCourt: CourtAddPayload): Promise<ICourt> => {
  return api.post<ICourt>('/api/admin/court', newCourt);
};

export const editCourt = async ({ id, data }: { id: number; data: CourtEditPayload }): Promise<void> => {
  return api.put(`/api/admin/court/${id}`, data);
};

export const removeCourt = async (id: number): Promise<void> => {
  return api.delete(`/api/admin/court/${id}`);
};

export const updateCourtPrice = async (payload: CourtPriceUpdatePayload): Promise<void> => {
  return api.put('/api/admin/court/price', payload);
};
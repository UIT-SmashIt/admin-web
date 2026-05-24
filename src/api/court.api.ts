import { api } from './apiClient.ts';
import type { ICourt, CourtAddPayload, CourtEditPayload } from '../types/court.type.ts';

// ===== Courts API =====
export const fetchCourts = async (): Promise<ICourt[]> => {
  return api.get<ICourt[]>('/api/court');
};

export const fetchCourtById = async (id: number): Promise<ICourt> => {
  return api.get<ICourt>(`/api/court/${id}`);
};

export const addCourt = async (newCourt: CourtAddPayload): Promise<ICourt> => {
  return api.post<ICourt>('/api/court', newCourt);
};

export const editCourt = async ({ id, data }: { id: number; data: CourtEditPayload }): Promise<void> => {
  return api.put(`/api/court/${id}`, data);
};

export const removeCourt = async (id: number): Promise<void> => {
  return api.delete(`/api/court/${id}`);
};

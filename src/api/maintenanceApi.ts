import {api} from "./apiClient.ts";
import type {
  IMaintenance,
  MaintenanceCreatePayload,
  MaintenanceEditPayload,
} from "../types/maintenance.type.ts";

export const fetchMaintenances = async (): Promise<IMaintenance[]> => {
  return api.get<IMaintenance[]>('/api/maintain');
}

export const createMaintenance = async (payload: MaintenanceCreatePayload): Promise<void> => {
  return api.post('/api/maintain', payload);
}

export const editMaintenance = async ({id, data}: {id: number, data: MaintenanceEditPayload}): Promise<void> => {
  return api.put(`/api/maintain/${id}`, data);
}

export const deleteMaintenance = async (id: number): Promise<void> => {
  return api.delete(`/api/maintain/${id}`);
}

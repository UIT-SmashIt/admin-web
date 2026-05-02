import {api} from "./apiClient.ts";
import type {AdminUpdatePayload, IAdmin} from "../types/admin.type.ts";

export const fetchAdmins = async (): Promise<IAdmin[]> => {
  return api.get<IAdmin[]>('api/admin/employee');
}

export const editAdmin = async ({id, data}: {id: number, data: AdminUpdatePayload}): Promise<void> => {
  return api.put(`/api/admin/employee/${id}`, data);
}

export const removeAdmin = async (id: number): Promise<void> => {
  return api.delete(`/api/admin/employee/${id}`);
}
import {api} from "./apiClient.ts";
import type {IAdmin} from "../types/admin.type.ts";

export const fetchAdmins = async (): Promise<IAdmin[]> => {
  return api.get<IAdmin[]>('api/admin/all');
}
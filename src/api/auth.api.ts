import {api} from "./apiClient.ts";
import type {AdminRegisterPayload} from "../types/auth.type.ts";

export const registerAdmin = async (newAdmin: AdminRegisterPayload): Promise<void> => {
  return api.post('/api/admin/auth/register', newAdmin);
}
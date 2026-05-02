import type {AdminRole} from "../const/adminRole.const.ts";

export interface IAdmin {
  adminId: number;
  adminName: string;
  email: string;
  phoneNumber: string;
  color: string;
  role: AdminRole
}

export interface AdminUpdatePayload {
  adminName: string;
  email: string;
  phoneNumber: string;
  role: AdminRole;
  color: string;
}
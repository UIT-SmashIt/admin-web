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

export interface CreateAdminPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  color: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
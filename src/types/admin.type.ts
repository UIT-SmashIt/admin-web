import type {AdminRole} from "../const/adminRole.const.ts";

export interface IAdmin {
  adminId: number;
  adminName: string;
  email: string;
  phoneNumber: string;
  color: string;
  role: AdminRole
}
export type MaintenanceStatus = 'Pending' | 'In Progress' | 'Completed';

export interface IMaintenance {
  maintainId: number;
  detail: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  facilityName: string;
  courtName: string;
}

export interface MaintenanceCreatePayload {
  detail: string;
  categoryId: number;
  facilityId: number;
  courtId: number;
}

export interface MaintenanceEditPayload {
  detail?: string;
  status?: MaintenanceStatus;
  categoryId?: number;
  facilityId?: number;
  courtId?: number;
}

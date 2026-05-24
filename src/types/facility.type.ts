export type FacilityStatus = 'Stock' | 'Out_of_stock' | 'Maintenance' | 'Damaged';

export interface IFacility {
  facilityId: string;
  facilityName: string;
  description: string;
  status: FacilityStatus;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
}

export interface FacilityAddPayload {
  facilityName: string;
  description: string;
  status: FacilityStatus;
  categoryId: string;
}

export interface FacilityEditPayload {
  facilityName?: string;
  description?: string;
  status?: FacilityStatus;
  categoryId?: string;
}

export interface IFacilityCategory {
  facilityCategoryId: string;
  name: string;
  description: string;
}

export interface FacilityCategoryAddPayload {
  name: string;
  description: string;
}

export interface FacilityCategoryEditPayload {
  name?: string;
  description?: string;
}

export interface IFacilityCriterion {
  criterionId: number;
  detail: string;
  schedule: string;
  categoryName: string;
}

export interface FacilityCriterionAddPayload {
  detail: string;
  schedule: string;
  categoryId: string;
}

export interface FacilityCriterionEditPayload {
  detail?: string;
  schedule?: string;
  categoryId?: string;
}

import { api } from './apiClient.ts';
import type {
  IFacility,
  FacilityAddPayload,
  FacilityEditPayload,
  IFacilityCategory,
  FacilityCategoryAddPayload,
  FacilityCategoryEditPayload,
  IFacilityCriterion,
  FacilityCriterionAddPayload,
  FacilityCriterionEditPayload,
} from '../types/facility.type.ts';

// ===== Facility API =====
export const fetchFacilities = async (): Promise<IFacility[]> => {
  return api.get<IFacility[]>('/api/facility');
};

export const fetchFacilityById = async (id: string): Promise<IFacility> => {
  return api.get<IFacility>(`/api/facility/${id}`);
};

export const addFacility = async (newFacility: FacilityAddPayload): Promise<IFacility> => {
  return api.post<IFacility>('/api/facility', newFacility);
};

export const editFacility = async ({ id, data }: { id: string; data: FacilityEditPayload }): Promise<void> => {
  return api.put(`/api/facility/${id}`, data);
};

export const removeFacility = async (id: string): Promise<void> => {
  return api.delete(`/api/facility/${id}`);
};

// ===== Facility Category API =====
export const fetchFacilityCategories = async (): Promise<IFacilityCategory[]> => {
  return api.get<IFacilityCategory[]>('/api/facility-category');
};

export const fetchFacilityCategoryById = async (id: string): Promise<IFacilityCategory> => {
  return api.get<IFacilityCategory>(`/api/facility-category/${id}`);
};

export const addFacilityCategory = async (
  newCategory: FacilityCategoryAddPayload
): Promise<IFacilityCategory> => {
  return api.post<IFacilityCategory>('/api/facility-category', newCategory);
};

export const editFacilityCategory = async ({
  id,
  data,
}: {
  id: string;
  data: FacilityCategoryEditPayload;
}): Promise<void> => {
  return api.put(`/api/facility-category/${id}`, data);
};

export const removeFacilityCategory = async (id: string): Promise<void> => {
  return api.delete(`/api/facility-category/${id}`);
};

// ===== Facility Criterion API =====
export const fetchFacilityCriteria = async (): Promise<IFacilityCriterion[]> => {
  return api.get<IFacilityCriterion[]>('/api/facility-criterion');
};

export const fetchFacilityCriterionById = async (id: number): Promise<IFacilityCriterion> => {
  return api.get<IFacilityCriterion>(`/api/facility-criterion/${id}`);
};

export const addFacilityCriterion = async (
  newCriterion: FacilityCriterionAddPayload
): Promise<IFacilityCriterion> => {
  return api.post<IFacilityCriterion>('/api/facility-criterion', newCriterion);
};

export const editFacilityCriterion = async ({
  id,
  data,
}: {
  id: number;
  data: FacilityCriterionEditPayload;
}): Promise<void> => {
  return api.put(`/api/facility-criterion/${id}`, data);
};

export const removeFacilityCriterion = async (id: number): Promise<void> => {
  return api.delete(`/api/facility-criterion/${id}`);
};

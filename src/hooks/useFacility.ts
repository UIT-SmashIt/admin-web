import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchFacilities,
  fetchFacilityById,
  addFacility,
  editFacility,
  removeFacility,
  fetchFacilityCategories,
  fetchFacilityCategoryById,
  addFacilityCategory,
  editFacilityCategory,
  removeFacilityCategory,
  fetchFacilityCriteria,
  fetchFacilityCriterionById,
  addFacilityCriterion,
  editFacilityCriterion,
  removeFacilityCriterion,
} from '../api/facility.api';
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
} from '../types/facility.type';

// ===== Facility Queries & Mutations =====

export const useFetchFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: fetchFacilities,
  });
};

export const useFetchFacilityById = (id: string) => {
  return useQuery({
    queryKey: ['facilities', id],
    queryFn: () => fetchFacilityById(id),
  });
};

export const useAddFacility = () => {
  const queryClient = useQueryClient();

  return useMutation<IFacility, Error, FacilityAddPayload>({
    mutationFn: addFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
};

export const useEditFacility = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; data: FacilityEditPayload }>({
    mutationFn: editFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
};

export const useRemoveFacility = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: removeFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
    },
  });
};

// ===== Facility Category Queries & Mutations =====

export const useFetchFacilityCategories = () => {
  return useQuery({
    queryKey: ['facility-categories'],
    queryFn: fetchFacilityCategories,
  });
};

export const useFetchFacilityCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['facility-categories', id],
    queryFn: () => fetchFacilityCategoryById(id),
  });
};

export const useAddFacilityCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<IFacilityCategory, Error, FacilityCategoryAddPayload>({
    mutationFn: addFacilityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-categories'] });
    },
  });
};

export const useEditFacilityCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; data: FacilityCategoryEditPayload }>({
    mutationFn: editFacilityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-categories'] });
    },
  });
};

export const useRemoveFacilityCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: removeFacilityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-categories'] });
    },
  });
};

// ===== Facility Criterion Queries & Mutations =====

export const useFetchFacilityCriteria = () => {
  return useQuery({
    queryKey: ['facility-criteria'],
    queryFn: fetchFacilityCriteria,
  });
};

export const useFetchFacilityCriterionById = (id: number) => {
  return useQuery({
    queryKey: ['facility-criteria', id],
    queryFn: () => fetchFacilityCriterionById(id),
  });
};

export const useAddFacilityCriterion = () => {
  const queryClient = useQueryClient();

  return useMutation<IFacilityCriterion, Error, FacilityCriterionAddPayload>({
    mutationFn: addFacilityCriterion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-criteria'] });
    },
  });
};

export const useEditFacilityCriterion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; data: FacilityCriterionEditPayload }>({
    mutationFn: editFacilityCriterion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-criteria'] });
    },
  });
};

export const useRemoveFacilityCriterion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: removeFacilityCriterion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-criteria'] });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCourts,
  fetchCourtById,
  addCourt,
  editCourt,
  removeCourt,
  updateCourtPrice,
} from '../api/court.api';
import type {
  ICourt,
  CourtAddPayload,
  CourtEditPayload,
  CourtPriceUpdatePayload,
} from '../types/court.type';

// ===== Courts Queries & Mutations =====

export const useFetchCourts = () => {
  return useQuery({
    queryKey: ['courts'],
    queryFn: fetchCourts,
  });
};

export const useFetchCourtById = (id: number) => {
  return useQuery({
    queryKey: ['courts', id],
    queryFn: () => fetchCourtById(id),
  });
};

export const useAddCourt = () => {
  const queryClient = useQueryClient();

  return useMutation<ICourt, Error, CourtAddPayload>({
    mutationFn: addCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
  });
};

export const useEditCourt = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; data: CourtEditPayload }>({
    mutationFn: editCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
  });
};

export const useRemoveCourt = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: removeCourt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
  });
};

export const useUpdateCourtPrice = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CourtPriceUpdatePayload>({
    mutationFn: updateCourtPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    },
  });
};
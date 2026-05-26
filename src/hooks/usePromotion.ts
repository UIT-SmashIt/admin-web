import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPromotion,
  deletePromotion,
  editPromotion,
  fetchPromotions,
} from "../api/promotionApi.ts";
import type { PromotionAddPayload, PromotionEditPayload } from "../types/promotion.type.ts";

export const useFetchPromotions = () => {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: fetchPromotions,
  });
};

export const useAddPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, PromotionAddPayload>({
    mutationFn: addPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useEditPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; data: PromotionEditPayload }>({
    mutationFn: editPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
};

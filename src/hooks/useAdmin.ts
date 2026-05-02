import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {editAdmin, fetchAdmins, removeAdmin} from "../api/admin.api.ts";
import type {AdminUpdatePayload} from "../types/admin.type.ts";

export const useFetchAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins
  });
}

export const useEditAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {id: number, data: AdminUpdatePayload}>({
    mutationFn: editAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admins']});
    },
  });
}

export const useRemoveAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: removeAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admins']});
    },
  })
}
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {editAdmin, fetchAdmins, removeAdmin, createAdmin, changePassword} from "../api/admin.api.ts";
import type {AdminUpdatePayload, CreateAdminPayload, ChangePasswordPayload} from "../types/admin.type.ts";

export const useFetchAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins
  });
}

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, CreateAdminPayload>({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['admins']});
    },
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

export const useChangePassword = () => {
  return useMutation<void, Error, {id: number, data: ChangePasswordPayload}>({
    mutationFn: changePassword,
  });
}
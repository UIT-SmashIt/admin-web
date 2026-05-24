import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  fetchMaintenances,
  createMaintenance,
  editMaintenance,
  deleteMaintenance,
} from "../api/maintenanceApi.ts";
import type {
  MaintenanceCreatePayload,
  MaintenanceEditPayload,
} from "../types/maintenance.type.ts";

export const useFetchMaintenances = () => {
  return useQuery({
    queryKey: ['maintenances'],
    queryFn: fetchMaintenances
  });
}

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, MaintenanceCreatePayload>({
    mutationFn: createMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['maintenances']});
    },
  });
}

export const useEditMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {id: number, data: MaintenanceEditPayload}>({
    mutationFn: editMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['maintenances']});
    },
  });
}

export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteMaintenance,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['maintenances']});
    },
  });
}

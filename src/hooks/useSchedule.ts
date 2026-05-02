import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addSchedule, editSchedule, fetchSchedules, removeSchedule} from "../api/schedule.api.ts";
import type {ScheduleAddPayload, ScheduleEditPayload} from "../types/schedule.type.ts";

export const useFetchSchedules = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: fetchSchedules
  });
}

export const useAddSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ScheduleAddPayload>({
    mutationFn: addSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['schedules']});
    },
  });
}

export const useEditSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, {id: number, data: ScheduleEditPayload}>({
    mutationFn: editSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['schedules']});
    },
  });
}

export const useRemoveSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: removeSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['schedules']});
    },
  })
}
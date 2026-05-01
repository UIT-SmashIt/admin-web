import {api} from "./apiClient.ts";
import type {ISchedule, ScheduleAddPayload, ScheduleEditPayload} from "../types/schedule.type.ts";

export const fetchSchedules = async (): Promise<ISchedule[]> => {
  return api.get<ISchedule[]>('api/admin/schedule');
}

export const addSchedule = async (newSchedule: ScheduleAddPayload): Promise<void> => {
  return api.post('/api/admin/schedule', newSchedule);
}

export const editSchedule = async ({id, data}: {id: number, data: ScheduleEditPayload}): Promise<void> => {
  return api.put(`/api/admin/schedule/${id}`, data);
}
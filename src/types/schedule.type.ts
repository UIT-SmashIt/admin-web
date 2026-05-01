export interface ISchedule {
  scheduleId: number;
  workDate: string;
  dayOfWeek: number;
  fromTime: string;
  toTime: string;
  adminIds: number[];
}

export interface AdminInfo {
  adminId: number;
  adminName: string;
}

export interface ScheduleAddPayload {
  workDate: string;
  dayOfWeek: number;
  fromTime: string;
  toTime: string;
  adminIds: number[];
}

export interface ScheduleEditPayload {
  fromTime: string;
  toTime: string;
  adminIds: number[];
}
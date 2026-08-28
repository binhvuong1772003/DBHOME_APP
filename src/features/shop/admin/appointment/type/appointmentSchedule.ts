import type { Appointment } from "@/features/shop/admin/appointment/type/appointment";

export interface AppointmentSchedule {
  openTime: string;
  closeTime: string;
}

export interface AppointmentScheduleResponse {
  date: string;
  timezone: string;
  isWorkDay: boolean;
  schedule: AppointmentSchedule | null;
  appointments: Appointment[];
  message?: string;
}

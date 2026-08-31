import type { Staff, StaffScheduleDay, StaffScheduleOffDay } from "./staff";
import type { AdminTimeOffRequest } from "../../workforce/types/workforce";

export type AttendanceApiStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "DAY_OFF_APPROVED";
export interface StaffAttendance {
  id: string; shopStaffId: string; date: string; checkIn?: string | null; checkOut?: string | null;
  status: AttendanceApiStatus; lateMinutes: number; workMinutes: number; note?: string | null;
}
export type AttendanceDisplayStatus = "WORKING" | "COMPLETED" | "LATE" | "ABSENT" | "APPROVED_LEAVE" | "SCHEDULED_OFF" | "SCHEDULED";
export interface AttendanceDisplayRecord {
  key: string; date: string; schedule?: StaffScheduleDay; attendance?: StaffAttendance;
  timeOff?: StaffScheduleOffDay; status: AttendanceDisplayStatus; overtimeMinutes: number;
}
export interface StaffTimeOffPage {
  data: AdminTimeOffRequest[];
  meta: { total: number; page: number; limit: number; totalPages: number; statusCounts: Record<"PENDING" | "APPROVED" | "REJECTED", number> };
}
export interface StaffDetailData { staff: Staff; schedule: StaffScheduleDay[]; offDays: StaffScheduleOffDay[] }

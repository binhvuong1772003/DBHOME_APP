import type { Staff, StaffScheduleResponse } from "../../staff/types/staff";

export interface StaffWithWeeklySchedule {
  staff: Staff;
  schedule: StaffScheduleResponse;
}

export type ScheduleStatusFilter = "ALL" | "WORKING" | "OFF" | "UNSCHEDULED";
export type ScheduleView = "WEEK" | "TODAY";

export interface AdminTimeOffRequest {
  id: string;
  shopStaffId: string;
  offDate: string;
  offDateEnd?: string | null;
  reason?: string | null;
  rejectReason?: string | null;
  approvedBy?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  shopStaff: Staff & {
    user?: {
      name?: string;
      email?: string;
      avatarUrl?: string | null;
    };
  };
}

export type TimeOffStatusFilter = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

export interface TimeOffPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: Record<"PENDING" | "APPROVED" | "REJECTED", number>;
}

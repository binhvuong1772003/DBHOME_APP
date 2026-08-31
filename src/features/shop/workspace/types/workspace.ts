import type { AppointmentStatus } from "@/features/shop/admin/appointment/constants/appointmentStatus";

export interface StaffWorkspaceAppointment {
  id: string;
  customerName: string;
  customerAvatar?: string | null;
  service: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  note?: string | null;
}

export interface WorkDay {
  id: string;
  weekdayKey: string;
  date: string;
  available: boolean;
  startTime: string;
  endTime: string;
}

export interface StaffScheduleItem {
  id: string;
  shopStaffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOff: boolean;
}

export interface StaffScheduleOffDay {
  id: string;
  shopStaffId: string;
  offDate: string;
  offDateEnd?: string | null;
  reason?: string | null;
  rejectReason?: string | null;
  approvedBy?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface StaffWorkScheduleResponse {
  shopId: string;
  staffId: string;
  schedule: StaffScheduleItem[];
  offDays: StaffScheduleOffDay[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  schedule: string;
  checkIn: string;
  checkOut: string;
  workedMinutes: number;
  status: "Working" | "Completed" | "Late";
}

export interface TimeOffRequest {
  id: string;
  shopStaffId: string;
  offDate: string;
  offDateEnd?: string | null;
  reason?: string | null;
  rejectReason?: string | null;
  approvedBy?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface StaffProfile {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  specialty: string;
  skills: string[];
  languages: string[];
  avatarUrl?: string;
}

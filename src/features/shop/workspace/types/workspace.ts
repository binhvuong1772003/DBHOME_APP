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
  from: string;
  to?: string;
  reasonKey: string;
  note?: string;
  status: "Pending" | "Approved" | "Rejected";
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

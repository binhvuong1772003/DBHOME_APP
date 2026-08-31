import type {
  AttendanceRecord,
  StaffProfile,
} from "../types/workspace";

export const attendanceHistory: AttendanceRecord[] = [
  { id: "att-0829", date: "2026-08-29", schedule: "09:00–18:00", checkIn: "08:54", checkOut: "—", workedMinutes: 332, status: "Working" },
  { id: "att-0828", date: "2026-08-28", schedule: "09:00–18:00", checkIn: "08:58", checkOut: "18:03", workedMinutes: 545, status: "Completed" },
  { id: "att-0827", date: "2026-08-27", schedule: "09:00–18:00", checkIn: "09:12", checkOut: "18:01", workedMinutes: 529, status: "Late" },
  { id: "att-0826", date: "2026-08-26", schedule: "09:00–18:00", checkIn: "08:57", checkOut: "18:00", workedMinutes: 543, status: "Completed" },
];

export const defaultStaffProfile: StaffProfile = {
  fullName: "Sophia Nguyen",
  email: "sophia.nguyen@example.com",
  phone: "+84 912 345 678",
  bio: "Senior nail artist focused on polished, natural-looking extensions and detailed custom art.",
  specialty: "Senior Nail Artist",
  skills: ["Gel Extension", "Nail Art", "Acrylic"],
  languages: ["English", "Vietnamese"],
};

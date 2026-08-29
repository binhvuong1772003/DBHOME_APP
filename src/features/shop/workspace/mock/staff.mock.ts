import type {
  AttendanceRecord,
  StaffProfile,
  TimeOffRequest,
  WorkDay,
} from "../types/workspace";

export const initialWorkWeek: WorkDay[] = [
  { id: "mon", weekdayKey: "weekdays.monday", date: "2026-08-31", available: true, startTime: "09:00", endTime: "18:00" },
  { id: "tue", weekdayKey: "weekdays.tuesday", date: "2026-09-01", available: true, startTime: "09:00", endTime: "18:00" },
  { id: "wed", weekdayKey: "weekdays.wednesday", date: "2026-09-02", available: false, startTime: "", endTime: "" },
  { id: "thu", weekdayKey: "weekdays.thursday", date: "2026-09-03", available: true, startTime: "10:00", endTime: "19:00" },
  { id: "fri", weekdayKey: "weekdays.friday", date: "2026-09-04", available: true, startTime: "09:00", endTime: "18:00" },
  { id: "sat", weekdayKey: "weekdays.saturday", date: "2026-09-05", available: true, startTime: "09:00", endTime: "17:00" },
  { id: "sun", weekdayKey: "weekdays.sunday", date: "2026-09-06", available: false, startTime: "", endTime: "" },
];

export const attendanceHistory: AttendanceRecord[] = [
  { id: "att-0829", date: "2026-08-29", schedule: "09:00–18:00", checkIn: "08:54", checkOut: "—", workedMinutes: 332, status: "Working" },
  { id: "att-0828", date: "2026-08-28", schedule: "09:00–18:00", checkIn: "08:58", checkOut: "18:03", workedMinutes: 545, status: "Completed" },
  { id: "att-0827", date: "2026-08-27", schedule: "09:00–18:00", checkIn: "09:12", checkOut: "18:01", workedMinutes: 529, status: "Late" },
  { id: "att-0826", date: "2026-08-26", schedule: "09:00–18:00", checkIn: "08:57", checkOut: "18:00", workedMinutes: 543, status: "Completed" },
];

export const initialTimeOffRequests: TimeOffRequest[] = [
  { id: "leave-0812", from: "2026-08-12", reasonKey: "timeOff.reasons.personal", status: "Approved" },
  { id: "leave-0904", from: "2026-09-04", to: "2026-09-05", reasonKey: "timeOff.reasons.vacation", status: "Pending" },
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

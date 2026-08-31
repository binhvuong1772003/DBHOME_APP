import dayjs from "@/lib/dayjs";
import type { StaffScheduleDay, StaffScheduleOffDay } from "../types/staff";
import type { AttendanceDisplayRecord, AttendanceDisplayStatus, StaffAttendance } from "../types/staffOperations";

export function formatMinutes(minutes: number) {
  const safe = Math.max(0, minutes || 0); const hours = Math.floor(safe / 60); const rest = safe % 60;
  if (!hours) return `${rest}m`; if (!rest) return `${hours}h`; return `${hours}h ${String(rest).padStart(2, "0")}m`;
}
export function isDateCovered(date: string, request: StaffScheduleOffDay) {
  const value = dayjs(date).startOf("day"); return !value.isBefore(dayjs(request.offDate).startOf("day")) && !value.isAfter(dayjs(request.offDateEnd ?? request.offDate).startOf("day"));
}
function scheduledMinutes(schedule?: StaffScheduleDay) {
  if (!schedule || schedule.isOff) return 0;
  const [startHour, startMinute] = schedule.startTime.split(":").map(Number); const [endHour, endMinute] = schedule.endTime.split(":").map(Number);
  return Math.max(0, endHour * 60 + endMinute - startHour * 60 - startMinute);
}
export function deriveAttendanceStatus(date: string, schedule: StaffScheduleDay | undefined, attendance: StaffAttendance | undefined, approvedLeave: StaffScheduleOffDay | undefined): AttendanceDisplayStatus {
  if (approvedLeave || attendance?.status === "DAY_OFF_APPROVED") return "APPROVED_LEAVE";
  if (!schedule || schedule.isOff) return "SCHEDULED_OFF";
  if (attendance?.status === "ABSENT") return "ABSENT";
  if (attendance?.lateMinutes && attendance.lateMinutes > 0 || attendance?.status === "LATE") return "LATE";
  if (attendance?.checkIn && !attendance.checkOut) return "WORKING";
  if (attendance?.checkIn || attendance?.checkOut) return "COMPLETED";
  const now = dayjs(); const scheduledStart = dayjs(`${date}T${schedule.startTime}`);
  return now.isBefore(scheduledStart) ? "SCHEDULED" : "ABSENT";
}
export function buildAttendanceDisplayRecords(from: string, to: string, schedules: StaffScheduleDay[], attendance: StaffAttendance[], offDays: StaffScheduleOffDay[]) {
  const scheduleByDay = new Map(schedules.map((item) => [item.dayOfWeek, item]));
  const attendanceByDate = new Map(attendance.map((item) => [dayjs(item.date).format("YYYY-MM-DD"), item]));
  const approved = offDays.filter((item) => item.status === "APPROVED"); const records: AttendanceDisplayRecord[] = [];
  let cursor = dayjs(from).startOf("day"); const end = dayjs(to).startOf("day");
  while (!cursor.isAfter(end)) {
    const date = cursor.format("YYYY-MM-DD"); const schedule = scheduleByDay.get(cursor.day()); const item = attendanceByDate.get(date); const timeOff = approved.find((request) => isDateCovered(date, request));
    records.push({ key: date, date, schedule, attendance: item, timeOff, status: deriveAttendanceStatus(date, schedule, item, timeOff), overtimeMinutes: Math.max(0, (item?.workMinutes ?? 0) - scheduledMinutes(schedule)) });
    cursor = cursor.add(1, "day");
  }
  return records.reverse();
}
export function attendanceStatusClass(status: AttendanceDisplayStatus) {
  if (status === "ABSENT") return "border-destructive/25 bg-destructive/10 text-destructive";
  if (status === "APPROVED_LEAVE") return "border-secondary/25 bg-secondary/10 text-secondary";
  if (status === "LATE") return "border-chart-3/25 bg-chart-3/10 text-foreground";
  if (status === "WORKING" || status === "COMPLETED") return "border-primary/25 bg-primary/10 text-primary";
  return "border-border bg-muted text-muted-foreground";
}

import dayjs from "@/lib/dayjs";
import type { StaffScheduleDay, StaffScheduleOffDay } from "../../staff/types/staff";

export function getWeekDates(anchorDate: dayjs.Dayjs) {
  const day = anchorDate.day();
  const monday = anchorDate.subtract(day === 0 ? 6 : day - 1, "day").startOf("day");
  return Array.from({ length: 7 }, (_, index) => monday.add(index, "day"));
}

export function getScheduleForDate(schedule: StaffScheduleDay[], date: dayjs.Dayjs) {
  return schedule.find((item) => item.dayOfWeek === date.day());
}

export function isApprovedTimeOff(offDays: StaffScheduleOffDay[], date: dayjs.Dayjs) {
  const target = date.format("YYYY-MM-DD");
  return offDays.some((item) => {
    if (item.status !== "APPROVED") return false;
    const start = dayjs(item.offDate).format("YYYY-MM-DD");
    const end = dayjs(item.offDateEnd ?? item.offDate).format("YYYY-MM-DD");
    return target >= start && target <= end;
  });
}

export function calculateWeeklyHours(schedule: StaffScheduleDay[]) {
  return schedule.reduce((total, item) => {
    if (item.isOff) return total;
    const [startHour = 0, startMinute = 0] = item.startTime.split(":").map(Number);
    const [endHour = 0, endMinute = 0] = item.endTime.split(":").map(Number);
    return total + Math.max(0, endHour * 60 + endMinute - startHour * 60 - startMinute);
  }, 0) / 60;
}

export function enumerateDateRange(start: string, end?: string | null, maxDays = 31) {
  const startDate = dayjs(start).startOf("day");
  const endDate = dayjs(end ?? start).startOf("day");
  const length = Math.min(maxDays, Math.max(0, endDate.diff(startDate, "day")) + 1);
  return Array.from({ length }, (_, index) => startDate.add(index, "day").format("YYYY-MM-DD"));
}

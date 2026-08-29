import type {
  Staff,
  StaffDisplayStatus,
  StaffRole,
  StaffRoleFilter,
  StaffSort,
  StaffStatusFilter,
} from "../types/staff";

export const PAGE_SIZE = 5;

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  STAFF: "Staff",
};

export const STAFF_ROLE_FILTER_OPTIONS: ReadonlyArray<{
  value: StaffRoleFilter;
  label: string;
}> = [
  { value: "ALL", label: "All Roles" },
  { value: "OWNER", label: STAFF_ROLE_LABELS.OWNER },
  { value: "MANAGER", label: STAFF_ROLE_LABELS.MANAGER },
  { value: "STAFF", label: STAFF_ROLE_LABELS.STAFF },
];

export const STAFF_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: StaffStatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ON_LEAVE", label: "On Leave" },
];

export const STAFF_SORT_OPTIONS: ReadonlyArray<{
  value: StaffSort;
  label: string;
}> = [
  { value: "RECENT", label: "Recently Added" },
  { value: "NAME_ASC", label: "Name A-Z" },
  { value: "NAME_DESC", label: "Name Z-A" },
  { value: "REVENUE", label: "Highest Revenue" },
];

export const getStaffName = (staff: Staff): string =>
  staff.nickname?.trim() ||
  staff.user?.name?.trim() ||
  staff.user?.email?.split("@")[0] ||
  `Staff ${staff.id}`;

export const getStaffEmail = (staff: Staff): string =>
  staff.user?.email ?? "Email unavailable";

export const getStaffInitials = (staff: Staff): string => {
  const parts = getStaffName(staff).trim().split(/\s+/);
  const initials =
    parts.length > 1
      ? `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`
      : (parts[0]?.slice(0, 2) ?? "");

  return initials.toUpperCase();
};

export const getStaffStatus = (staff: Staff): StaffDisplayStatus => {
  if (staff.isOnLeave) return "ON_LEAVE";
  return staff.isActive ? "ACTIVE" : "INACTIVE";
};

export const getStaffSchedule = (staff: Staff): string | null => {
  if (!staff.schedule) return null;
  return `${staff.schedule.startTime} – ${staff.schedule.endTime}`;
};

export const getStaffAppointments = (staff: Staff): number | null =>
  staff.appointmentsToday ?? null;

export const getStaffRevenue = (staff: Staff): number | null =>
  staff.revenueToday ?? null;

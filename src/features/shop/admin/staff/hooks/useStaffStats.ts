import { useMemo } from "react";
import { getStaffStatus } from "../constants/staff";
import type { Staff, StaffStats } from "../types/staff";

interface StaffStatsAccumulator extends StaffStats {
  shifts: Set<string>;
}

export const useStaffStats = (staffs: Staff[]): StaffStats =>
  useMemo(() => {
    const now = new Date();
    const stats = staffs.reduce<StaffStatsAccumulator>(
      (result, staff) => {
        const status = getStaffStatus(staff);
        const joinedAt = new Date(staff.joinedAt);

        result.total += 1;
        result[staff.role.toLowerCase() as Lowercase<typeof staff.role>] += 1;
        if (status === "ACTIVE") result.active += 1;
        if (status === "INACTIVE") result.inactive += 1;
        if (status === "ON_LEAVE") result.onLeave += 1;
        if (status === "ACTIVE" && staff.schedule) result.workingToday += 1;
        if (staff.schedule) {
          result.shifts.add(
            staff.schedule.shift ??
              `${staff.schedule.startTime}-${staff.schedule.endTime}`,
          );
        }
        if (
          joinedAt.getFullYear() === now.getFullYear() &&
          joinedAt.getMonth() === now.getMonth()
        ) {
          result.joinedThisMonth += 1;
        }
        return result;
      },
      {
        total: 0,
        active: 0,
        inactive: 0,
        manager: 0,
        owner: 0,
        staff: 0,
        workingToday: 0,
        onLeave: 0,
        shiftCount: 0,
        joinedThisMonth: 0,
        returningTomorrow: 0,
        shifts: new Set<string>(),
      },
    );

    const { shifts, ...publicStats } = stats;
    return { ...publicStats, shiftCount: shifts.size };
  }, [staffs]);

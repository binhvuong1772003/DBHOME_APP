import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import {
  getStaffSchedule,
  getStaffs,
  updateStaffSchedule,
} from "../../staff/services/staffService";
import type { StaffScheduleDay } from "../../staff/types/staff";
import type { StaffWithWeeklySchedule } from "../types/workforce";

const defaultPagination = { total: 0, page: 1, limit: 5, totalPages: 1 };

export function useWeeklyStaffSchedules(page: number, search?: string) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [items, setItems] = useState<StaffWithWeeklySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(defaultPagination);

  const refetch = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const staffResponse = await getStaffs(shopSlug, {
        page,
        limit: 5,
        search: search || undefined,
        status: "ACTIVE",
        sort: "NAME_ASC",
      });
      const staffs = staffResponse.data;
      const scheduleResponses = await Promise.all(
        staffs.map((staff) => getStaffSchedule(shopSlug, staff.id)),
      );
      setItems(
        staffs.map((staff, index) => ({
          staff,
          schedule: scheduleResponses[index],
        })),
      );
      setPagination(staffResponse.meta);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load staff schedules"));
    } finally {
      setIsLoading(false);
    }
  }, [page, search, shopSlug]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const saveSchedule = useCallback(async (staffId: string, schedule: StaffScheduleDay[]) => {
    if (!shopSlug) return false;
    setIsSaving(true);
    try {
      const updated = await updateStaffSchedule(shopSlug, staffId, schedule);
      setItems((current) => current.map((item) =>
        item.staff.id === staffId
          ? { ...item, schedule: { ...item.schedule, schedule: updated } }
          : item,
      ));
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to update staff schedule"));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [shopSlug]);

  return { items, pagination, isLoading, isSaving, error, refetch, saveSchedule };
}

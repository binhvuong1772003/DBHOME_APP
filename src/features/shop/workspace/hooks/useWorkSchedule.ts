import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";
import { getStaffWorkSchedule } from "../services/workScheduleService";
import type {
  StaffWorkScheduleResponse,
  WorkDay,
} from "../types/workspace";

const weekdayKeys = [
  "weekdays.sunday",
  "weekdays.monday",
  "weekdays.tuesday",
  "weekdays.wednesday",
  "weekdays.thursday",
  "weekdays.friday",
  "weekdays.saturday",
] as const;

interface WorkScheduleState {
  requestKey: string | null;
  data: StaffWorkScheduleResponse | null;
  error: Error | null;
}

const initialState: WorkScheduleState = {
  requestKey: null,
  data: null,
  error: null,
};

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Unable to load the staff work schedule");
}

function toDateKey(value: string): string {
  return value.includes("T") ? value.slice(0, 10) : value;
}

function mapWorkDay(
  data: StaffWorkScheduleResponse,
  dateValue: string,
): WorkDay {
  const date = dayjs(dateValue).startOf("day");
  const scheduleByWeekday = new Map(
    data.schedule.map((item) => [item.dayOfWeek, item]),
  );
  const approvedOffDays = data.offDays.filter(
    (offDay) => offDay.status === "APPROVED",
  );

  const dateKey = date.format("YYYY-MM-DD");
  const dayOfWeek = date.day();
  const schedule = scheduleByWeekday.get(dayOfWeek);
  const isApprovedOffDay = approvedOffDays.some((offDay) => {
    const from = toDateKey(offDay.offDate);
    const to = toDateKey(offDay.offDateEnd ?? offDay.offDate);
    return dateKey >= from && dateKey <= to;
  });
  const available = Boolean(schedule && !schedule.isOff && !isApprovedOffDay);

  return {
    id: schedule?.id ?? `${data.staffId}-${dateKey}`,
    weekdayKey: weekdayKeys[dayOfWeek],
    date: dateKey,
    available,
    startTime: available ? schedule?.startTime ?? "" : "",
    endTime: available ? schedule?.endTime ?? "" : "",
  };
}

function mapCurrentWeek(data: StaffWorkScheduleResponse): WorkDay[] {
  const today = dayjs().startOf("day");
  const monday = today.subtract((today.day() + 6) % 7, "day");
  return Array.from({ length: 7 }, (_, offset) =>
    mapWorkDay(data, monday.add(offset, "day").format("YYYY-MM-DD")),
  );
}

export function useWorkSchedule(selectedDate?: string) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const {
    membership,
    isLoading: isMembershipLoading,
    error: membershipError,
  } = useShopMembership();
  const staffId = membership?.staffId;
  const requestKey = shopSlug && staffId ? `${shopSlug}:${staffId}` : null;
  const [state, setState] = useState<WorkScheduleState>(initialState);

  useEffect(() => {
    let cancelled = false;
    if (!shopSlug || !staffId || !requestKey) return;

    getStaffWorkSchedule(shopSlug, staffId)
      .then((data) => {
        if (cancelled) return;
        setState({ requestKey, data, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ requestKey, data: null, error: normalizeError(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, shopSlug, staffId]);

  const refetch = useCallback(async () => {
    if (!shopSlug || !staffId || !requestKey) return;

    setState({ requestKey, data: null, error: null });
    try {
      const data = await getStaffWorkSchedule(shopSlug, staffId);
      setState({ requestKey, data, error: null });
    } catch (error) {
      setState({ requestKey, data: null, error: normalizeError(error) });
    }
  }, [requestKey, shopSlug, staffId]);

  const belongsToCurrentRequest = state.requestKey === requestKey;
  const data = belongsToCurrentRequest ? state.data : null;
  const error = membershipError ?? (belongsToCurrentRequest ? state.error : null);
  const days = useMemo(() => (data ? mapCurrentWeek(data) : []), [data]);
  const selectedDay = useMemo(
    () => (data && selectedDate ? mapWorkDay(data, selectedDate) : null),
    [data, selectedDate],
  );

  return {
    days,
    selectedDay,
    offDays: data?.offDays ?? [],
    isLoading:
      isMembershipLoading ||
      Boolean(requestKey && (!belongsToCurrentRequest || (!data && !error))),
    error,
    refetch,
  };
}

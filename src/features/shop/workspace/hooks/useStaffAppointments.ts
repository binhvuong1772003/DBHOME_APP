import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyAppointmentsByDate } from "../services/staffAppointmentService";
import type { StaffAppointmentApiItem } from "../services/staffAppointmentService";
import type { StaffWorkspaceAppointment } from "../types/workspace";

interface StaffAppointmentState {
  requestKey: string | null;
  data: StaffAppointmentApiItem[] | null;
  error: Error | null;
}

const initialState: StaffAppointmentState = {
  requestKey: null,
  data: null,
  error: null,
};

function normalizeError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Unable to load staff appointments");
}

function getDurationMinutes(startTime: string, endTime: string): number {
  const [startHour = 0, startMinute = 0] = startTime.split(":").map(Number);
  const [endHour = 0, endMinute = 0] = endTime.split(":").map(Number);
  return Math.max(0, endHour * 60 + endMinute - (startHour * 60 + startMinute));
}

function mapAppointment(
  appointment: StaffAppointmentApiItem,
): StaffWorkspaceAppointment {
  const serviceNames = appointment.services.map((item) => item.serviceName);
  const packageNames = appointment.packages.flatMap((item) => {
    const name = item.package?.name ?? item.packageName;
    return name ? [name] : [];
  });
  const addonNames = appointment.addons.flatMap((item) =>
    item.addon?.name ? [item.addon.name] : [],
  );

  return {
    id: appointment.id,
    customerName: appointment.customer.name,
    customerAvatar: appointment.customer.avatarUrl,
    service: [...serviceNames, ...packageNames, ...addonNames].join(", "),
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    durationMinutes: getDurationMinutes(
      appointment.startTime,
      appointment.endTime,
    ),
    status: appointment.status,
    note: appointment.note,
  };
}

export function useStaffAppointments(date: string) {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const requestKey = shopSlug && date ? `${shopSlug}:${date}` : null;
  const [state, setState] = useState<StaffAppointmentState>(initialState);

  useEffect(() => {
    let cancelled = false;
    if (!shopSlug || !date || !requestKey) return;

    getMyAppointmentsByDate(shopSlug, date)
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
  }, [date, requestKey, shopSlug]);

  const refetch = useCallback(async () => {
    if (!shopSlug || !date || !requestKey) return;

    setState({ requestKey, data: null, error: null });
    try {
      const data = await getMyAppointmentsByDate(shopSlug, date);
      setState({ requestKey, data, error: null });
    } catch (error) {
      setState({ requestKey, data: null, error: normalizeError(error) });
    }
  }, [date, requestKey, shopSlug]);

  const belongsToCurrentRequest = state.requestKey === requestKey;
  const data = belongsToCurrentRequest ? state.data : null;
  const error = belongsToCurrentRequest ? state.error : null;
  const appointments = useMemo(
    () =>
      (data ?? [])
        .map(mapAppointment)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [data],
  );

  return {
    appointments,
    isLoading: Boolean(
      requestKey && (!belongsToCurrentRequest || (!data && !error)),
    ),
    error,
    refetch,
  };
}

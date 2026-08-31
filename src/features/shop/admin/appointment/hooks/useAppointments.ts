import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Appointment } from "@/features/shop/admin/appointment/type/appointment";
import type {
  AppointmentScheduleResponse,
  AppointmentSchedule,
} from "@/features/shop/admin/appointment/type/appointmentSchedule";
import { useAsync } from "@/hooks/common/useAsync";
import { getAppointmentByDateWithSlot } from "../services/appointmentService";
const emptySchedule: AppointmentSchedule = {
  openTime: "00:00",
  closeTime: "00:00",
};
export const useAppointments = (externalDate?: string) => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedule, setSchedule] = useState<AppointmentSchedule>(emptySchedule);
  const { isLoading, run, error } = useAsync<void>();
  const fetchAppointmentsSchedule = useCallback(async () => {
    if (!shopSlug || !externalDate) return;
    return run(async () => {
      const data: AppointmentScheduleResponse =
        await getAppointmentByDateWithSlot(shopSlug, { date: externalDate });
      setAppointments(data.appointments ?? []);
      setSchedule(data.schedule ?? emptySchedule);
    });
  }, [shopSlug, externalDate, run]);
  useEffect(() => {
    void fetchAppointmentsSchedule();
  }, [fetchAppointmentsSchedule]);
  return {
    appointments,
    setAppointments,
    schedule,
    setSchedule,
    isLoading,
    error,
    refetch: fetchAppointmentsSchedule,
  };
};

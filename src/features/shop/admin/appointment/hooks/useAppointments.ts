import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import type { Appointment } from "@/features/shop/admin/appointment/type/appointment";
import type {
  AppointmentSchedule,
  AppointmentScheduleResponse,
} from "@/features/shop/admin/appointment/type/appointmentSchedule";
import { getAppointmentByDateWithSlot } from "../services/appointmentService";

export const useAppointments = (externalDate?: string) => {
  const { t } = useTranslation("appointment");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedule, setSchedule] = useState<AppointmentSchedule | null>(null);
  const [isWorkDay, setIsWorkDay] = useState(true);
  const [timezone, setTimezone] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchAppointmentsSchedule = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    if (!shopSlug || !externalDate) return;

    setIsLoading(true);
    setError(null);

    try {
      const data: AppointmentScheduleResponse =
        await getAppointmentByDateWithSlot(shopSlug, { date: externalDate });

      if (requestId !== requestIdRef.current) return;

      setAppointments(data.appointments ?? []);
      setSchedule(data.schedule ?? null);
      setIsWorkDay(data.isWorkDay !== false);
      setTimezone(data.timezone ?? null);
      setMessage(data.message ?? null);
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return;
      setAppointments([]);
      setSchedule(null);
      setIsWorkDay(false);
      setTimezone(null);
      setMessage(null);
      setError(
        getApiErrorMessage(requestError, t("toolbar.loadError")),
      );
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [externalDate, shopSlug, t]);

  useEffect(() => {
    void fetchAppointmentsSchedule();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchAppointmentsSchedule]);

  return {
    appointments,
    setAppointments,
    schedule,
    setSchedule,
    isWorkDay,
    timezone,
    message,
    isLoading,
    error,
    refetch: fetchAppointmentsSchedule,
  };
};

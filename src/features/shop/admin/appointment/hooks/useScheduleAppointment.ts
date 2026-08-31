import { useState } from "react";
import { useAppointments } from "./useAppointments";
import type { Appointment } from "../type/appointment";
import { useMiniCalendar } from "./useMiniCalendar";
import { useChangeAppointmentStatus } from "../hooks/useChangeAppointmentStatus";

export const useScheduleAppointment = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const {
    calendarDays,
    mutedList,
    selectedDate,
    setSelectedDate: setCalendarDate,
    currentMonth,
  } = useMiniCalendar();
  const setSelectedDate = (date: string) => {
    setSelectedAppointment(null);
    setCalendarDate(date);
  };

  const {
    appointments,
    setAppointments,
    schedule,
    setSchedule,
    isLoading,
    error,
    refetch: refetchAppointments,
  } = useAppointments(selectedDate);
  const { changeAppointmentStatus, isLoading: isChangingStatus } =
    useChangeAppointmentStatus();
  const handleStatusChange = async (
    status: "CONFIRMED" | "CANCELLED" | "IN_PROGRESS" | "DONE" | "NO_SHOW",
  ) => {
    if (!selectedAppointment) return;

    try {
      await changeAppointmentStatus(selectedAppointment.id, status);

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, status }
            : appointment,
        ),
      );

      setSelectedAppointment((current) =>
        current ? { ...current, status } : current,
      );
    } catch {
      return;
    }
  };
  const openHour = Number(schedule.openTime.split(":")[0]);
  const closeHour = Number(schedule.closeTime.split(":")[0]);
  const slot = Array.from(
    { length: closeHour - openHour },
    (_, i) => openHour + i,
  );
  const workHour = closeHour - openHour;
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "CONFIRMED",
  );
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };
  return {
    appointments,
    setAppointments,
    completedAppointments,
    schedule,
    setSchedule,
    slot,
    workHour,
    openHour,
    closeHour,
    isLoading,
    error,
    selectedAppointment,
    setSelectedAppointment,
    handleAppointmentClick,
    calendarDays,
    mutedList,
    selectedDate,
    setSelectedDate,
    currentMonth,
    handleStatusChange,
    isChangingStatus,
    refetchAppointments,
  };
};

import { useState } from "react";
import { useAppointments } from "./useAppointments";
import type { Appointment } from "../type/appointment";
import { useMiniCalendar } from "./useMiniCalendar";
import { useChangeAppointmentStatus } from "../hooks/useChangeAppointmentStatus";
import type { AppointmentStatusUpdate } from "../constants/appointmentStatus";
import { parseTimeToMinutes } from "../utils/scheduleUtils";

export const useScheduleAppointment = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const {
    calendarDays,
    mutedList,
    selectedDate,
    setSelectedDate: setCalendarDate,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    todayDate,
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
    isWorkDay,
    timezone,
    message,
    isLoading,
    error,
    refetch: refetchAppointments,
  } = useAppointments(selectedDate);
  const { changeAppointmentStatus, isLoading: isChangingStatus } =
    useChangeAppointmentStatus();
  const handleStatusChange = async (
    input: AppointmentStatusUpdate,
  ) => {
    if (!selectedAppointment) return false;

    try {
      const updatedAppointment = await changeAppointmentStatus(
        selectedAppointment.id,
        input,
      );
      const nextAppointment = updatedAppointment ?? {
        ...selectedAppointment,
        status: input.status,
      };

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? nextAppointment
            : appointment,
        ),
      );

      setSelectedAppointment(nextAppointment);
      await refetchAppointments();
      return true;
    } catch {
      return false;
    }
  };
  const openMinutes = parseTimeToMinutes(schedule?.openTime) ?? 0;
  const closeMinutes = parseTimeToMinutes(schedule?.closeTime) ?? openMinutes;
  const hasValidSchedule = closeMinutes > openMinutes;
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "COMPLETED",
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
    openMinutes,
    closeMinutes,
    hasValidSchedule,
    isWorkDay,
    timezone,
    message,
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
    goToPreviousMonth,
    goToNextMonth,
    todayDate,
    handleStatusChange,
    isChangingStatus,
    refetchAppointments,
  };
};

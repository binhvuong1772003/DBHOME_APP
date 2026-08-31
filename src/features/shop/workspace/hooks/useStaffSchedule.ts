import { useStaffAppointments } from "./useStaffAppointments";
import { useWorkSchedule } from "./useWorkSchedule";

export function useStaffSchedule(date: string) {
  const appointmentState = useStaffAppointments(date);
  const workScheduleState = useWorkSchedule(date);
  const selectedDay = workScheduleState.selectedDay;

  return {
    appointments: appointmentState.appointments,
    schedule: {
      openTime: selectedDay?.available ? selectedDay.startTime : "00:00",
      closeTime: selectedDay?.available ? selectedDay.endTime : "00:00",
    },
    isLoading: appointmentState.isLoading || workScheduleState.isLoading,
    error: appointmentState.error ?? workScheduleState.error,
    refetch: async () => {
      await Promise.all([
        appointmentState.refetch(),
        workScheduleState.refetch(),
      ]);
    },
  };
}

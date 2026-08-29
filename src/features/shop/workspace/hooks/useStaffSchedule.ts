import { useMemo } from "react";
import { useAppointments } from "@/features/shop/admin/appointment/hooks/useAppointments";
import { useStaffs } from "@/features/shop/admin/appointment/hooks/useStaffs";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { StaffWorkspaceAppointment } from "../types/workspace";

export function useStaffSchedule(date: string) {
  const { user } = useAuth();
  const { staffs, isLoading: isStaffLoading, error: staffError } = useStaffs();
  const { appointments, schedule, isLoading, error } = useAppointments(date);

  const currentStaff = useMemo(
    () => staffs.find((staff) => staff.userId === user?.id || staff.user?.id === user?.id),
    [staffs, user?.id],
  );

  const staffAppointments = useMemo<StaffWorkspaceAppointment[]>(() => {
    const staffId = currentStaff?.id ?? user?.id;
    const ownAppointments = staffId
      ? appointments.filter((appointment) => appointment.staffId === staffId)
      : [];

    return ownAppointments
      .map((appointment) => {
        const [startHour = 0, startMinute = 0] = appointment.startTime.split(":").map(Number);
        const [endHour = 0, endMinute = 0] = appointment.endTime.split(":").map(Number);
        return {
          id: appointment.id,
          customerName: appointment.customer.name,
          customerAvatar: appointment.customer.avatarUrl,
          service: [
            ...appointment.services.map((service) => service.serviceName),
            ...appointment.packages.map((item) => item.package.name),
          ].join(", "),
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          durationMinutes: endHour * 60 + endMinute - (startHour * 60 + startMinute),
          status: appointment.status,
          note: appointment.note,
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, currentStaff, user?.id]);

  return {
    appointments: staffAppointments,
    schedule,
    currentStaff,
    isLoading: isLoading || isStaffLoading,
    error: error ?? staffError,
  };
}

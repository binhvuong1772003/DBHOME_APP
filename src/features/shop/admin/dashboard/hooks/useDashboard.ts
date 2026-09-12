import { useNavigate } from "react-router-dom";
import { useGetAppointment } from "@/features/shop/admin/appointment/hooks/useGetAppointment";
import { useChangeAppointmentStatus } from "@/features/shop/admin/appointment/hooks/useChangeAppointmentStatus";
import { useTopCustomer } from "@/features/shop/admin/dashboard/hooks/useTopCustomer";
import { useCountService } from "@/features/shop/admin/dashboard/hooks/useCountService";
import { useWeeklyIncomeByDay } from "@/features/shop/admin/dashboard/hooks/useWeeklyIncomeByDay";
import { usePendingPayments } from "@/features/shop/admin/dashboard/hooks/usePendingPayments";
import type { AppointmentStatusUpdate } from "@/features/shop/admin/appointment/constants/appointmentStatus";
export const useShopDashBoard = () => {
  const navigate = useNavigate();
  const {
    topCustomers,
    isLoading: isLoadingTopCustomer,
    error: errorTopCustomer,
    retry: retryTopCustomer,
  } = useTopCustomer();
  const {
    countServices,
    isLoading: isLoadingCountService,
    error: errorCountService,
    retry: retryCountService,
  } = useCountService();
  const {
    weeklyIncomeByDay,
    isLoading: isLoadingWeeklyIncome,
    error: errorWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
    retry: retryWeeklyIncome,
  } = useWeeklyIncomeByDay();
  const {
    appointments,
    isLoading: isLoadingAppointments,
    refetch,
    error: errorAppointments,
    date: appointmentDate,
    clearNew,
    newIds,
    updateAppointment,
  } = useGetAppointment();
  const { changeAppointmentStatus, isLoading: isChanging } =
    useChangeAppointmentStatus();
  const pendingPayments = usePendingPayments();

  const handleAddService = () => {
    navigate("services/create");
  };

  const handleConfirm = (appointmentId: string) => async () => {
    await changeAppointmentStatus(appointmentId, { status: "CONFIRMED" });
    clearNew(appointmentId);
    await refetch();
    return true;
  };

  const handleReject =
    (appointmentId: string, cancelReason: string) => async () => {
      await changeAppointmentStatus(appointmentId, {
        status: "CANCELLED",
        cancelReason,
      });
      clearNew(appointmentId);
      await refetch();
      return true;
    };
  const handleChangeStatus = async (
    appointmentId: string,
    input: AppointmentStatusUpdate,
  ) => {
    await changeAppointmentStatus(appointmentId, input);
    updateAppointment(appointmentId, { status: input.status });
    return true;
  };
  const completed = appointments
    .filter((a) => a.status === "COMPLETED")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const pending = appointments
    .filter((a) => a.status === "PENDING")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const canceled = appointments
    .filter((a) => a.status === "CANCELLED")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const others = appointments
    .filter(
      (a) =>
        a.status !== "PENDING" &&
        a.status !== "COMPLETED" &&
        a.status !== "CANCELLED",
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const sortApointments = [...pending, ...others, ...completed, ...canceled];

  return {
    newIds,
    clearNew,
    handleAddService,
    handleConfirm,
    handleReject,
    appointments,
    isLoadingAppointments,
    isChanging,
    topCustomers,
    isLoadingTopCustomer,
    errorTopCustomer,
    retryTopCustomer,
    countServices,
    isLoadingCountService,
    errorCountService,
    retryCountService,
    weeklyIncomeByDay,
    isLoadingWeeklyIncome,
    errorWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
    appointmentDate,
    errorAppointments,
    retryAppointments: refetch,
    retryWeeklyIncome,
    pendingPayments,
    sortApointments,
    handleChangeStatus,
  };
};

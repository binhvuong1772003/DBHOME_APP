import { useNavigate } from "react-router-dom";
import { useGetAppointment } from "@/hooks/useGetAppointment";
import { useChangeAppointmentStatus } from "@/features/shop/admin/appointment/hooks/useChangeAppointmentStatus";
import { useTopCustomer } from "@/hooks/shops/customer/useTopCustomer";
import { useCountService } from "@/hooks/shops/services/useCountService";
import { useWeeklyIncomeByDay } from "@/hooks/shops/income/useWeeklyIncomeByDay";
import type { AppointmentStatus } from "@/features/shop/admin/appointment/constants/appointmentStatus";
export const useShopDashBoard = () => {
  const navigate = useNavigate();
  const {
    topCustomers,
    isLoading: isLoadingTopCustomer,
    error: errorTopCustomer,
  } = useTopCustomer();
  const {
    countServices,
    isLoading: isLoadingCountService,
    error: errorCountService,
  } = useCountService();
  const {
    weeklyIncomeByDay,
    isLoading: isLoadingWeeklyIncome,
    error: errorWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
  } = useWeeklyIncomeByDay();
  const {
    appointments,
    isLoading: isLoadingAppointments,
    refetch,
    clearNew,
    newIds,
    updateAppointment,
  } = useGetAppointment();
  const { changeAppointmentStatus, isLoading: isChanging } =
    useChangeAppointmentStatus();

  const handleAddService = () => {
    navigate("services/create");
  };

  const handleConfirm = (appointmentId: string) => async () => {
    await changeAppointmentStatus(appointmentId, "CONFIRMED");
    clearNew(appointmentId);
    refetch();
  };

  const handleReject = (appointmentId: string) => async () => {
    await changeAppointmentStatus(appointmentId, "CANCELLED");
    clearNew(appointmentId);
    refetch();
  };
  const handleChangeStatus = async (
    appointmentId: string,
    status: Exclude<AppointmentStatus, "PENDING">,
  ) => {
    await changeAppointmentStatus(appointmentId, status);
    updateAppointment(appointmentId, { status });
  };
  const done = appointments
    .filter((a) => a.status === "DONE")
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
        a.status !== "DONE" &&
        a.status !== "CANCELLED",
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const sortApointments = [...pending, ...others, ...done, ...canceled];

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
    countServices,
    isLoadingCountService,
    errorCountService,
    weeklyIncomeByDay,
    isLoadingWeeklyIncome,
    errorWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
    sortApointments,
    handleChangeStatus,
  };
};

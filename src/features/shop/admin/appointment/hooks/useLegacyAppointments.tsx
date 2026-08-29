import { useEffect, useState } from "react";
import { getAppointmentByDay } from "@/features/shop/admin/appointment/services/appointmentService";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
export const useAppointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  }); // "2026-08-13"
  useEffect(() => {
    if (!shopSlug) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const data = await getAppointmentByDay(shopSlug, { date: today });
        console.log("response:", data); // xem field thật tên gì
        setAppointments(data ?? []);
      } catch (error) {
        setApiError(
          error instanceof AxiosError
            ? error.response?.data?.message || "Lấy dữ liệu thất bại"
            : "Đã xảy ra lỗi không xác định",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);
  return { appointments, isLoading, apiError };
};

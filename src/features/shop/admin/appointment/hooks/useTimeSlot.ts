import { getTimeSlots } from "@/services/calenderService";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const useTimeSlot = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [date, setDate] = useState<string>(() =>
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }),
  );
  const changeDate = (days: number) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + days);
    setDate(currentDate.toISOString().split("T")[0]);
  };
  useEffect(() => {
    if (!shopSlug) return;
    const fetchTimeSlots = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const data = await getTimeSlots(shopSlug, { date });
        setTimeSlots(data.slots);
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi không xác định",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeSlots();
  }, []);

  return { timeSlots, isLoading, apiError, date, changeDate };
};

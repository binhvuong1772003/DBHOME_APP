import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
export interface WeeklyIncome {
  weekRange: string;
  days: Array<{ day: string; date: string; income: number }>;
  today: { fullDate: string; income: number };
  weeklyTotal: number;
}
export const getIncomeByDayWeekly = async (shopSlug: string) => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<WeeklyIncome>>(
    `/api/shops/${shopSlug}/appointments/income/weekly`,
  );
  return response.data;
};

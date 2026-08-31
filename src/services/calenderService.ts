import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";

export interface TimeSlotsResponse {
  date: string;
  isWorkDay: boolean;
  openTime?: string;
  closeTime?: string;
  slotInterval?: number;
  slots: string[];
  totalSlots?: number;
  message?: string;
}

export const getTimeSlots = async (
  shopSlug: string,
  params: { date: string },
) => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<TimeSlotsResponse>>(
    `/api/shops/${shopSlug}/calendar/time-slots/`,
    { params },
  );
  return response.data;
};

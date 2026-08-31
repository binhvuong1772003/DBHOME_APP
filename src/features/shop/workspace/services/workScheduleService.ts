import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { StaffWorkScheduleResponse } from "../types/workspace";

export async function getStaffWorkSchedule(
  shopSlug: string,
  staffId: string,
): Promise<StaffWorkScheduleResponse> {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<StaffWorkScheduleResponse>>(
    `/api/shops/${shopSlug}/staff/${staffId}/schedule`,
  );

  return response.data;
}

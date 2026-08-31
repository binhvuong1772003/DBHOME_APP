import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { TimeOffRequest } from "../types/workspace";

export interface CreateTimeOffRequestInput {
  offDate: string;
  offDateEnd?: string;
  reason?: string;
}

export async function getMyTimeOffRequests(
  shopSlug: string,
): Promise<TimeOffRequest[]> {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<TimeOffRequest[]>>(
    `/api/shops/${shopSlug}/staff/off-days`,
    { params: { assignedToMe: true } },
  );

  return response.data;
}

export async function createTimeOffRequest(
  shopSlug: string,
  staffId: string,
  input: CreateTimeOffRequestInput,
): Promise<TimeOffRequest> {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<TimeOffRequest>>(
    `/api/shops/${shopSlug}/staff/${staffId}/off-days`,
    input,
  );

  return response.data;
}

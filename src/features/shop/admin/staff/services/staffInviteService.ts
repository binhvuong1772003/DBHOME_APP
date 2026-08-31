import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";

export const acceptStaffInvite = async (shopSlug: string, token: string) => {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<unknown>>(
    `/api/shops/${encodeURIComponent(shopSlug)}/staff/invite/accept`,
    undefined,
    { params: { token } },
  );
  return response.data;
};

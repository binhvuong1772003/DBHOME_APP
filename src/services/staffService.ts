import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { Staff } from "@/features/shop/admin/staff/types/staff";

export const getListStaff = async (shopSlug: string) => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Staff[]>>(`/api/shops/${shopSlug}/staff`, {
    params: { page: 1, limit: 50 },
  });
  return response.data;
};

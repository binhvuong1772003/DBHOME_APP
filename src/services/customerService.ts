import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";

export interface TopCustomer {
  id: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  lastAppointmentDate: string;
  totalSpent: number;
  totalAppointments: number;
}

export const getTopCustomer = async (shopSlug: string, limit: number = 5) => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<TopCustomer[]>>(
    `/api/shops/${shopSlug}/customers/top`,
    { params: { limit } },
  );
  return response.data;
};

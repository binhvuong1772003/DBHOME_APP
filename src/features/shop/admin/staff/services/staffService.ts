import axiosClient from "@/api/axiosClient";
import type { InviteStaffInput, Staff, UpdateStaffInput } from "../types/staff";

interface ApiResponse<T> {
  data: T;
}

export const getStaffs = async (shopSlug: string): Promise<Staff[]> => {
  const { data } = await axiosClient.get<ApiResponse<Staff[]>>(
    `/api/shops/${shopSlug}/staff`,
  );
  return data.data;
};

export const inviteStaff = async (
  shopSlug: string,
  input: InviteStaffInput,
): Promise<void> => {
  await axiosClient.post(`/api/shops/${shopSlug}/staff/invite`, input);
};

export const updateStaff = async (
  shopSlug: string,
  staffId: string,
  input: UpdateStaffInput,
): Promise<Staff> => {
  const { data } = await axiosClient.patch<ApiResponse<Staff>>(
    `/api/shops/${shopSlug}/staff/${staffId}/info`,
    input,
  );
  return data.data;
};

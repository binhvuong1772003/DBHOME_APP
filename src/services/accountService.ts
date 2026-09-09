import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { User } from "@/type/auth";

export const updateMyProfile = async (data: { name: string }) => {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<User>>("/auth/me", data);
  return response.data;
};

export const uploadMyAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<User>>(
    "/auth/me/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

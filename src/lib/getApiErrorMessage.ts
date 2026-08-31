import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/api/apiResponse";

export function getApiErrorMessage(
  err: unknown,
  fallback = "Đã xảy ra lỗi không xác định",
) {
  if (err instanceof AxiosError) {
    const response = (err as AxiosError<ApiErrorResponse>).response;
    const backendMessage = response?.data?.error?.message;
    if (backendMessage) return backendMessage;

    if (!response) {
      return "Không thể kết nối tới máy chủ, kiểm tra lại mạng";
    }

    return fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

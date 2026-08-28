import { AxiosError } from "axios";

export function getApiErrorMessage(
  err: unknown,
  fallback = "Đã xảy ra lỗi không xác định",
) {
  if (err instanceof AxiosError) {
    const backendMessage = err.response?.data?.message;
    if (backendMessage) return backendMessage;

    if (!err.response) {
      return "Không thể kết nối tới máy chủ, kiểm tra lại mạng";
    }

    return fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

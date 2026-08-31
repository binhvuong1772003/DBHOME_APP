import axiosClient from '@/api/axiosClient';
import type { ApiSuccessResponse, PaginatedApiResponse, PaginationMeta } from '@/api/apiResponse';
export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
export const getListNotification = async (shopSlug: string) => {
  const { data: response } = await axiosClient.get<PaginatedApiResponse<NotificationItem[], PaginationMeta>>(
    `/api/shops/${shopSlug}/notifications`
  );
  return response.data;
};
export const markNotificationRead = async (shopSlug: string, id: string) => {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<NotificationItem>>(
    `/api/shops/${shopSlug}/notifications/${id}`
  );
  return response.data;
};
export const deleteNotification = async (shopSlug: string, id: string) => {
  const { data: response } = await axiosClient.delete<ApiSuccessResponse<NotificationItem>>(
    `/api/shops/${shopSlug}/notifications/${id}`
  );
  return response.data;
};

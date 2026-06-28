import axiosClient from '@/api/axiosClient';
export const getListNotification = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/notifications`
  );
  return res.data;
};
export const markNotificationRead = async (shopSlug: string, id: string) => {
  const { data: res } = await axiosClient.patch(
    `/api/shops/${shopSlug}/notifications/${id}`
  );
  return res;
};
export const deleteNotification = async (shopSlug: string, id: string) => {
  const { data: res } = await axiosClient.delete(
    `/api/shops/${shopSlug}/notifications/${id}`
  );
  return res;
};

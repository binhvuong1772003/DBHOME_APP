import axiosClient from "@/api/axiosClient";

export const getTimeSlots = async (
  shopSlug: string,
  params: { date: string },
) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/calendar/time-slots/`,
    { params },
  );
  return res.data;
};

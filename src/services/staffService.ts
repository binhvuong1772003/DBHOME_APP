import axiosClient from "@/api/axiosClient";

export const getListStaff = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(`/api/shops/${shopSlug}/staff`);
  return res.data;
};

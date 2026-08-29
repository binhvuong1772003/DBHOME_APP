import axiosClient from "@/api/axiosClient";

export const getListStaff = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(`/api/shops/${shopSlug}/staff`, {
    params: { page: 1, limit: 50 },
  });
  return res.data;
};

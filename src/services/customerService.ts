import axiosClient from "@/api/axiosClient";

export const getTopCustomer = async (shopSlug: string, limit: number = 5) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/customers/top`,
    { params: { limit } },
  );
  return res.data;
};

import axiosClient from "@/api/axiosClient";

export const acceptStaffInvite = async (shopSlug: string, token: string) => {
  const { data } = await axiosClient.post(
    `/api/shops/${encodeURIComponent(shopSlug)}/staff/invite/accept`,
    undefined,
    { params: { token } },
  );
  return data.data;
};

import axiosClient from "@/api/axiosClient";

export const getListService = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/services`,
  );
  return res.data;
};

export const createService = async (shopSlug: string, formData: FormData) => {
  const { data: res } = await axiosClient.post(
    `/api/shops/${shopSlug}/services`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};
export const updateServiceStatus = async (
  shopSlug: string,
  serviceId: string,
  isActive: boolean,
) => {
  const { data: res } = await axiosClient.patch(
    `/api/shops/${shopSlug}/services/${serviceId}`,
    { isActive },
  );
  return res.data;
};
export const countService = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/services/count`,
  );
  return res.data;
};

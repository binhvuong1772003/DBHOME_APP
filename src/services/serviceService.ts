import axiosClient from "@/api/axiosClient";
import type { ServiceListQuery, ServiceListResponse } from "@/types/service";

export const getListService = async (shopSlug: string, query: ServiceListQuery = {}): Promise<ServiceListResponse> => {
  const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== ""));
  const { data: res } = await axiosClient.get(`/api/shops/${shopSlug}/services`, { params });
  return { items: res.data ?? [], meta: res.meta };
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

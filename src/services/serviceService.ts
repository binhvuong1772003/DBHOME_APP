import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse, PaginatedApiResponse } from "@/api/apiResponse";
import type { Service, ServiceCategory, ServiceCategoryListQuery, ServiceCategoryListResponse, ServiceListQuery, ServiceListResponse } from "@/types/service";

export const getListService = async (shopSlug: string, query: ServiceListQuery = {}): Promise<ServiceListResponse> => {
  const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== ""));
  const { data: response } = await axiosClient.get<PaginatedApiResponse<Service[], ServiceListResponse["meta"]>>(`/api/shops/${shopSlug}/services`, { params });
  return { items: response.data, meta: response.meta };
};

export const createService = async (shopSlug: string, formData: FormData) => {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<Service>>(
    `/api/shops/${shopSlug}/services`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};
export const updateServiceStatus = async (
  shopSlug: string,
  serviceId: string,
  isActive: boolean,
) => {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Service>>(
    `/api/shops/${shopSlug}/services/${serviceId}`,
    { isActive },
  );
  return response.data;
};
export const countService = async (shopSlug: string) => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<number>>(
    `/api/shops/${shopSlug}/services/count`,
  );
  return response.data;
};

export const getServiceById = async (shopSlug: string, serviceId: string): Promise<Service> => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Service>>(`/api/shops/${shopSlug}/services/${serviceId}`);
  return response.data;
};

export const updateService = async (shopSlug: string, serviceId: string, formData: FormData) => {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Service>>(
    `/api/shops/${shopSlug}/services/${serviceId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const getServiceCategories = async (shopSlug: string, query: ServiceCategoryListQuery = {}): Promise<ServiceCategoryListResponse> => {
  const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== ""));
  const { data: response } = await axiosClient.get<PaginatedApiResponse<ServiceCategory[], ServiceCategoryListResponse["meta"]>>(`/api/shops/${shopSlug}/services/categories`, { params });
  return { items: response.data, meta: response.meta };
};

export const createServiceCategory = async (shopSlug: string, input: { name: string }) => {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<ServiceCategory>>(`/api/shops/${shopSlug}/services/categories`, input);
  return response.data;
};

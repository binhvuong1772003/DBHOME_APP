import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { Shop } from "@/type/shop";
import type {
  CreateShopInput,
  UpdateShopInput,
  BusinessHoursInput,
} from "@/validations/shopSchema";

const buildJsonData = (
  data: CreateShopInput | UpdateShopInput | Partial<UpdateShopInput>,
) => {
  const result: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });

  return result;
};

export const createShop = async (
  data: CreateShopInput,
  logo?: File | null,
  background?: File | null,
) => {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<Shop>>(
    "/api/shops",
    buildJsonData(data),
  );
  if (logo) await uploadShopLogo(response.data.slug, logo);
  if (background) await uploadShopBanner(response.data.slug, background);
  return response.data;
};

export const updateShop = async (
  shopSlug: string,
  data: Partial<UpdateShopInput>,
  logo?: File | null,
  background?: File | null,
) => {
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Shop>>(
    `/api/shops/${shopSlug}`,
    buildJsonData(data),
  );
  if (logo) await uploadShopLogo(shopSlug, logo);
  if (background) await uploadShopBanner(shopSlug, background);
  return response.data;
};

export const uploadShopLogo = async (shopSlug: string, file: File) => {
  const formData = new FormData();
  formData.append("logo", file);
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Shop>>(
    `/api/shops/${shopSlug}/logo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const uploadShopBanner = async (shopSlug: string, file: File) => {
  const formData = new FormData();
  formData.append("banner", file);
  const { data: response } = await axiosClient.patch<ApiSuccessResponse<Shop>>(
    `/api/shops/${shopSlug}/banner`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const getShops = async () => {
  const { data: response } =
    await axiosClient.get<ApiSuccessResponse<Shop[]>>("/api/shops");
  return response.data;
};

export const getShopDetail = async (shopSlug: string) => {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<Shop>>(
    `/api/shops/${shopSlug}`,
  );
  return response.data;
};

export const getBusinessHours = async (shopSlug: string) => {
  const { data: response } = await axiosClient.get<
    ApiSuccessResponse<BusinessHoursInput>
  >(`/api/shops/${shopSlug}/business-hours`);
  return response.data;
};

export const updateBusinessHours = async (
  shopSlug: string,
  data: BusinessHoursInput,
) => {
  const { data: response } = await axiosClient.patch<
    ApiSuccessResponse<BusinessHoursInput>
  >(`/api/shops/${shopSlug}/business-hours`, data);
  return response.data;
};

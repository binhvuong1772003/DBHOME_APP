import axiosClient from '@/api/axiosClient';
import type {
  CreateShopInput,
  UpdateShopInput,
} from '@/validations/shopSchema';

const buildAddress = (data: CreateShopInput | UpdateShopInput) =>
  [data.address, data.district, data.city].filter(Boolean).join(', ');

const buildJsonData = (data: CreateShopInput | UpdateShopInput) => {
  const fullAddress = buildAddress(data);
  const result: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'city' || key === 'district') return;
    if (key === 'address') {
      if (fullAddress) result['address'] = fullAddress;
      return;
    }
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });

  return result;
};

export const createShop = async (
  data: CreateShopInput,
  logo?: File | null,
  background?: File | null
) => {
  const { data: res } = await axiosClient.post(
    '/api/shops',
    buildJsonData(data)
  );
  if (logo) await uploadShopLogo(res.data.slug, logo);
  if (background) await uploadShopBanner(res.data.slug, background);
  return res;
};

export const updateShop = async (
  shopSlug: string,
  data: UpdateShopInput,
  logo?: File | null,
  background?: File | null
) => {
  const { data: res } = await axiosClient.patch(
    `/api/shops/${shopSlug}`,
    buildJsonData(data)
  );
  if (logo) await uploadShopLogo(shopSlug, logo);
  if (background) await uploadShopBanner(shopSlug, background);
  return res;
};

export const uploadShopLogo = async (shopSlug: string, file: File) => {
  const formData = new FormData();
  formData.append('logo', file);
  const { data: res } = await axiosClient.patch(
    `/api/shops/${shopSlug}/logo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res;
};

export const uploadShopBanner = async (shopSlug: string, file: File) => {
  const formData = new FormData();
  formData.append('banner', file);
  const { data: res } = await axiosClient.patch(
    `/api/shops/${shopSlug}/banner`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res;
};

export const getShops = async () => {
  const { data: res } = await axiosClient.get('/api/shops');
  return res.data;
};

export const getShopDetail = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(`/api/shops/${shopSlug}`);
  return res.data;
};

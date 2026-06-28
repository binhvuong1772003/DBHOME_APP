import axiosClient from '@/api/axiosClient';
import { type CreateServiceInput } from '@/validations/serviceSchema';
export const getListService = async (shopSlug: string) => {
  const { data: res } = await axiosClient.get(
    `/api/shops/${shopSlug}/services`
  );
  console.log(`/api/shops/${shopSlug}/services`);
  return res.data;
};
export const createService = async (
  shopSlug: string,
  data: CreateServiceInput
) => {
  const { data: res } = await axiosClient.post(
    `/api/shops/${shopSlug}/services`,
    data
  );
  console.log(`/api/shops/${shopSlug}/services`);
  return res.data;
};

import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse, PaginatedApiResponse } from "@/api/apiResponse";
import type { CustomerDetail, CustomerListItem, CustomerListMeta, CustomerListQuery } from "../types/customer";

export async function getCustomers(shopSlug: string, query: CustomerListQuery) {
  const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== "ALL"));
  const { data: response } = await axiosClient.get<PaginatedApiResponse<CustomerListItem[], CustomerListMeta>>(
    `/api/shops/${shopSlug}/customers`,
    { params },
  );
  return { data: response.data, meta: response.meta };
}

export async function getCustomerDetail(shopSlug: string, customerId: string) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<CustomerDetail>>(
    `/api/shops/${shopSlug}/customers/${customerId}`,
  );
  return response.data;
}

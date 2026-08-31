import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse } from "@/api/apiResponse";
import type { ShopMembership } from "../types/shopMembership";

export async function getCurrentShopMembership(
  shopSlug: string,
): Promise<ShopMembership> {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<ShopMembership>>(
    `/api/shops/${shopSlug}/members/me`,
  );

  return response.data;
}

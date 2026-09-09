import axiosClient from "@/api/axiosClient";
import type { PaginatedApiResponse, PaginationMeta } from "@/api/apiResponse";
import type { Service } from "@/types/service";
import type { ShopType } from "@/type/shop";

export interface PublicMarketplaceShop {
  id: string;
  name: string;
  slug: string;
  type?: ShopType;
  address?: string;
  city?: string;
  district?: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  timezone: string;
  services: Service[];
}

export const getPublicMarketplaceShops = async (
  query: { page?: number; limit?: number; search?: string; city?: string } = {},
) => {
  const params = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
  const { data: response } = await axiosClient.get<
    PaginatedApiResponse<PublicMarketplaceShop[], PaginationMeta>
  >("/api/marketplace/shops", { params });
  return { items: response.data, meta: response.meta };
};

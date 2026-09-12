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
  description?: string | null;
  services: Service[];
  matchedServices?: PublicMarketplaceMatchedService[];
}

export interface PublicMarketplaceMatchedService {
  id: string;
  name: string;
  basePrice?: number | null;
  durationMin: number;
}

export const getPublicMarketplaceShops = async (
  query: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    type?: ShopType;
  } = {},
) => {
  const params = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== ""),
  );
  const { data: response } = await axiosClient.get<
    PaginatedApiResponse<PublicMarketplaceShop[], PaginationMeta>
  >("/api/marketplace/shops", { params });
  return { items: response.data, meta: response.meta };
};

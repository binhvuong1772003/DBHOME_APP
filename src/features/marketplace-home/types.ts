import type { Service } from "@/types/service";

export interface MarketplaceService extends Service {
  shopName: string;
  shopSlug: string;
}

export interface MarketplaceShop {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  timezone: string;
  type?: "NAIL" | "SPA" | "HAIR" | "COMBO";
  address?: string;
  city?: string;
  district?: string;
  services: Service[];
}

export interface MarketplaceTestimonial {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer: { name: string; avatarUrl?: string | null };
  shopName: string;
  shopSlug: string;
}

export interface MarketplaceBeforeAfter {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  serviceName?: string;
  shopName?: string;
  shopSlug?: string;
}

export interface MarketplaceImage {
  src: string;
  alt: string;
}

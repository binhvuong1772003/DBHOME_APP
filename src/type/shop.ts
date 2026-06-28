// types/shop.type.ts

export type ShopType = 'NAIL' | 'SPA' | 'HAIR' | 'COMBO';

export interface CreateShopInput {
  name: string;
  slug: string;
  type: ShopType;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  description?: string;
  openTime?: string; // "08:00"
  closeTime?: string; // "20:00"
  workDays?: number[]; // [1,2,3,4,5,6]
}

export interface Shop extends CreateShopInput {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  logoUrl?: string;
  coverUrl?: string;
  timezone: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopResponse {
  success: boolean;
  data: Shop;
}

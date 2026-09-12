export interface PublicShopServiceOptionValue {
  id: string;
  name: string;
  price: number;
  duration?: number | null;
  sortOrder?: number;
}

export interface PublicShopServiceOption {
  id: string;
  serviceId: string;
  name: string;
  isRequired: boolean;
  sortOrder: number;
  values: PublicShopServiceOptionValue[];
}

export interface PublicShopService {
  id: string;
  shopId: string;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
  } | null;
  name: string;
  description?: string | null;
  basePrice?: number | null;
  durationMin: number;
  imageUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  options: PublicShopServiceOption[];
}

export interface PublicShopStaff {
  id: string;
  nickname?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  user: { name: string; avatarUrl?: string | null };
}

export interface PublicShopBusinessHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface PublicShopReview {
  id: string;
  rating: number;
  comment?: string | null;
  replyContent?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  customer: { name: string; avatarUrl?: string | null };
}

export interface PublicShopReviewMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PublicShopPage {
  id: string;
  name: string;
  slug: string;
  type?: "NAIL" | "SPA" | "HAIR" | "COMBO";
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  openTime: string;
  closeTime: string;
  workDays: number[];
  timezone: string;
  businessHours: PublicShopBusinessHour[];
  services: PublicShopService[];
  staffMembers: PublicShopStaff[];
  reviews: PublicShopReview[];
  rating: { average?: number | null; count: number };
}

export interface PublicShopAvailability {
  date: string;
  isWorkDay: boolean;
  staffAvailable?: boolean;
  openTime?: string;
  closeTime?: string;
  availableSlots: string[];
  message?: string;
}

export interface PublicBookingDraft {
  shopSlug: string;
  serviceIds: string[];
  staffId?: string;
  date: string;
  startTime?: string;
  serviceOptions?: { serviceId: string; optionValueIds: string[] }[];
}

export interface PublicBookingInput {
  date: string;
  startTime: string;
  staffId?: string;
  serviceIds: string[];
  serviceOptions?: { serviceId: string; optionValueIds: string[] }[];
  source: "WEBSITE";
}

export interface PublicBookingResult {
  id: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
}

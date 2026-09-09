import axiosClient from "@/api/axiosClient";
import type { ApiSuccessResponse, PaginatedApiResponse } from "@/api/apiResponse";
import type {
  PublicBookingInput,
  PublicBookingResult,
  PublicShopAvailability,
  PublicShopPage,
  PublicShopReview,
  PublicShopReviewMeta,
} from "../types";

export async function getPublicShop(shopSlug: string) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<PublicShopPage>>(
    `/api/marketplace/shops/${shopSlug}`,
  );
  return response.data;
}

export async function getPublicShopAvailability(
  shopSlug: string,
  query: { date: string; durationMin: number; staffId?: string },
) {
  const { data: response } = await axiosClient.get<ApiSuccessResponse<PublicShopAvailability>>(
    `/api/marketplace/shops/${shopSlug}/availability`,
    { params: query },
  );
  return response.data;
}

export async function getPublicShopReviews(
  shopSlug: string,
  query: { page?: number; limit?: number } = {},
) {
  const { data: response } = await axiosClient.get<
    PaginatedApiResponse<PublicShopReview[], PublicShopReviewMeta>
  >(`/api/marketplace/shops/${shopSlug}/reviews`, { params: query });
  return { items: response.data, meta: response.meta };
}

export async function createPublicShopBooking(shopSlug: string, input: PublicBookingInput) {
  const { data: response } = await axiosClient.post<ApiSuccessResponse<PublicBookingResult>>(
    `/api/shops/${shopSlug}/appointments/self`,
    input,
  );
  return response.data;
}

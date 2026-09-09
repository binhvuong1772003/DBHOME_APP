import { useEffect, useMemo, useState } from "react";
import { getPublicMarketplaceShops } from "@/services/marketplaceService";
import { getPublicShopReviews } from "@/features/public-shop/services/publicShopService";
import type { MarketplaceService, MarketplaceShop, MarketplaceTestimonial } from "../types";

interface MarketplaceState {
  shops: MarketplaceShop[];
  services: MarketplaceService[];
  loading: boolean;
  error: boolean;
  testimonials: MarketplaceTestimonial[];
  testimonialsLoading: boolean;
  testimonialsError: boolean;
  retry: () => void;
}

export function useMarketplaceHome(): MarketplaceState {
  const [shops, setShops] = useState<MarketplaceShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [testimonials, setTestimonials] = useState<MarketplaceTestimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoading(true);
      setError(false);
      try {
        const response = await getPublicMarketplaceShops({ page: 1, limit: 12 });
        if (!cancelled) setShops(response.items);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadServices();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  useEffect(() => {
    if (!shops.length) {
      setTestimonials([]);
      setTestimonialsLoading(false);
      setTestimonialsError(false);
      return;
    }

    let cancelled = false;
    setTestimonialsLoading(true);
    setTestimonialsError(false);

    const reviewRequests: Promise<MarketplaceTestimonial[] | null>[] = shops.slice(0, 3).map(async (shop) => {
      try {
        const response = await getPublicShopReviews(shop.slug, { page: 1, limit: 3 });
        return response.items.map<MarketplaceTestimonial>((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          customer: review.customer,
          shopName: shop.name,
          shopSlug: shop.slug,
        }));
      } catch {
        return null;
      }
    });

    void Promise.all(reviewRequests).then((groups) => {
      if (cancelled) return;
      const loaded = groups
        .filter((group): group is MarketplaceTestimonial[] => group !== null)
        .flat()
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 6);
      setTestimonials(loaded);
      setTestimonialsError(groups.every((group) => group === null));
    }).finally(() => {
      if (!cancelled) setTestimonialsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [shops]);

  const marketplaceShops = useMemo(() => shops, [shops]);
  const services = useMemo(
    () => marketplaceShops.flatMap((shop) => shop.services.map((service) => ({ ...service, shopName: shop.name, shopSlug: shop.slug }))),
    [marketplaceShops],
  );

  return {
    shops: marketplaceShops,
    services,
    loading,
    error,
    testimonials,
    testimonialsLoading,
    testimonialsError,
    retry: () => setAttempt((value) => value + 1),
  };
}

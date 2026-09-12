import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPublicMarketplaceShops } from "@/services/marketplaceService";
import type { PaginationMeta } from "@/api/apiResponse";
import type { PublicMarketplaceShop } from "@/services/marketplaceService";
import type { ShopType } from "@/type/shop";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

export const MARKETPLACE_PAGE_LIMIT = 24;
export const SHOP_TYPES: ShopType[] = ["NAIL", "SPA", "HAIR", "COMBO"];

export interface MarketplaceSearchQuery {
  search?: string;
  city?: string;
  type?: ShopType;
  page: number;
}

const isShopType = (value: string | null): value is ShopType =>
  Boolean(value && SHOP_TYPES.includes(value as ShopType));

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function readQuery(params: URLSearchParams): MarketplaceSearchQuery {
  const search = params.get("search")?.trim().slice(0, 100) || undefined;
  const city = params.get("city")?.trim().slice(0, 100) || undefined;
  const typeValue = params.get("type");
  return {
    search,
    city,
    type: isShopType(typeValue) ? typeValue : undefined,
    page: parsePage(params.get("page")),
  };
}

function queryString(query: MarketplaceSearchQuery) {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.city) params.set("city", query.city);
  if (query.type) params.set("type", query.type);
  if (query.page > 1 || query.search || query.city || query.type) {
    params.set("page", String(query.page));
  }
  return params.toString();
}

export function useMarketplaceSearch(fallbackMessage = "Unable to load shops") {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => readQuery(searchParams), [searchParams]);
  const [draftSearch, setDraftSearch] = useState(query.search ?? "");
  const [draftCity, setDraftCity] = useState(query.city ?? "");
  const [items, setItems] = useState<PublicMarketplaceShop[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedQueryKey, setLoadedQueryKey] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const syncDraft = window.setTimeout(() => {
      setDraftSearch(query.search ?? "");
      setDraftCity(query.city ?? "");
    }, 0);

    const normalized = queryString(query);
    if (normalized !== searchParams.toString()) {
      setSearchParams(normalized, { replace: true });
    }
    return () => window.clearTimeout(syncDraft);
  }, [query, searchParams, setSearchParams]);

  const currentQueryKey = queryString(query);
  useEffect(() => {
    const currentRequest = ++requestId.current;

    void getPublicMarketplaceShops({
      page: query.page,
      limit: MARKETPLACE_PAGE_LIMIT,
      search: query.search,
      city: query.city,
      type: query.type,
    })
      .then((response) => {
        if (currentRequest !== requestId.current) return;
        setItems(response.items);
        setMeta(response.meta);
        setError(null);
        setLoadedQueryKey(currentQueryKey);
        if (response.meta.page !== query.page) {
          setSearchParams(
            queryString({
              search: query.search,
              city: query.city,
              type: query.type,
              page: response.meta.page,
            }),
            { replace: true },
          );
        }
      })
      .catch((requestError: unknown) => {
        if (currentRequest !== requestId.current) return;
        setError(getApiErrorMessage(requestError, fallbackMessage));
        setLoadedQueryKey(currentQueryKey);
      })
      .finally(() => {
        if (currentRequest === requestId.current) setLoading(false);
      });
  }, [currentQueryKey, fallbackMessage, query.city, query.page, query.search, query.type, setSearchParams]);

  const updateQuery = useCallback(
    (updates: Partial<MarketplaceSearchQuery>) => {
      const next: MarketplaceSearchQuery = {
        search: "search" in updates
          ? updates.search?.trim().slice(0, 100) || undefined
          : query.search,
        city: "city" in updates
          ? updates.city?.trim().slice(0, 100) || undefined
          : query.city,
        type: "type" in updates ? updates.type : query.type,
        page: updates.page ?? 1,
      };
      setSearchParams(queryString(next));
    },
    [query.city, query.search, query.type, setSearchParams],
  );

  const submitSearch = useCallback(() => {
    updateQuery({ search: draftSearch, city: draftCity, page: 1 });
  }, [draftCity, draftSearch, updateQuery]);

  const clearFilters = useCallback(() => {
    setSearchParams("");
  }, [setSearchParams]);

  const retry = useCallback(() => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    void getPublicMarketplaceShops({
      page: query.page,
      limit: MARKETPLACE_PAGE_LIMIT,
      search: query.search,
      city: query.city,
      type: query.type,
    })
      .then((response) => {
        if (currentRequest !== requestId.current) return;
        setItems(response.items);
        setMeta(response.meta);
        setError(null);
        setLoadedQueryKey(currentQueryKey);
        if (response.meta.page !== query.page) {
          setSearchParams(
            queryString({
              search: query.search,
              city: query.city,
              type: query.type,
              page: response.meta.page,
            }),
            { replace: true },
          );
        }
      })
      .catch((requestError: unknown) => {
        if (currentRequest !== requestId.current) return;
        setError(getApiErrorMessage(requestError, fallbackMessage));
        setLoadedQueryKey(currentQueryKey);
      })
      .finally(() => {
        if (currentRequest === requestId.current) setLoading(false);
      });
  }, [currentQueryKey, fallbackMessage, query.city, query.page, query.search, query.type, setSearchParams]);

  const isLoading = loading || loadedQueryKey !== currentQueryKey;
  const currentError = loadedQueryKey === currentQueryKey ? error : null;

  return {
    query,
    draftSearch,
    draftCity,
    setDraftSearch,
    setDraftCity,
    items,
    meta,
    loading: isLoading,
    error: currentError,
    submitSearch,
    clearFilters,
    retry,
    updateQuery,
    hasFilters: Boolean(query.search || query.city || query.type),
  };
}

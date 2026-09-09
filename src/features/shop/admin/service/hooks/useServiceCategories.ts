import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { createServiceCategory, getServiceCategories } from "@/services/serviceService";
import type { ServiceCategory } from "@/types/service";

interface UseServiceCategoriesOptions {
  load?: boolean;
  limit?: number;
}

export function useServiceCategories({ load = true, limit = 50 }: UseServiceCategoriesOptions = {}) {
  const { t } = useTranslation("service");
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false });

  const refetch = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getServiceCategories(shopSlug, { page, limit });
      setCategories(result.items);
      setMeta(result.meta);
      setPage(result.meta.page);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t("category.loadError")));
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, shopSlug, t]);

  useEffect(() => {
    if (!load) {
      setIsLoading(false);
      return;
    }
    void refetch();
  }, [load, refetch]);

  const create = useCallback(async (name: string) => {
    if (!shopSlug || isCreating) return undefined;
    setIsCreating(true);
    setError(null);
    try {
      const category = await createServiceCategory(shopSlug, { name: name.trim() });
      return category;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t("category.createError")));
      return undefined;
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, shopSlug, t]);

  return { categories, isLoading, isCreating, error, refetch, create, meta, page: meta.page, totalPages: meta.totalPages, setPage };
}

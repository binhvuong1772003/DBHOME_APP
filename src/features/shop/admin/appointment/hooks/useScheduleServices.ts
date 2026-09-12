import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getListService } from "@/services/serviceService";
import type { Service } from "@/types/service";

export function useScheduleServices() {
  const { t } = useTranslation("appointment");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchServices = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    if (!shopSlug) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getListService(shopSlug, {
        page: 1,
        limit: 100,
        status: "ACTIVE",
        sort: "NAME_ASC",
      });
      if (requestId === requestIdRef.current) setServices(response.items ?? []);
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return;
      setServices([]);
      setError(
        getApiErrorMessage(requestError, t("toolbar.serviceLoadError")),
      );
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [shopSlug, t]);

  useEffect(() => {
    void fetchServices();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchServices]);

  return { services, isLoading, error, refetch: fetchServices };
}

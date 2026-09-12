import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getCustomerDetail } from "../services/customerService";
import type { CustomerDetail } from "../types/customer";

export function useCustomerDetail(customerId: string | undefined) {
  const { t } = useTranslation("customers");
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const load = useCallback(async () => {
    if (!shopSlug || !customerId) return;
    const currentRequest = ++requestId.current;
    setIsLoading(true); setError(null);
    try {
      const result = await getCustomerDetail(shopSlug, customerId);
      if (currentRequest === requestId.current) setCustomer(result);
    } catch (requestError) {
      if (currentRequest === requestId.current) setError(getApiErrorMessage(requestError, t("detail.loadError")));
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [customerId, shopSlug, t]);
  useEffect(() => { void load(); }, [load]);
  return { shopSlug, customer, isLoading, error, refetch: load };
}

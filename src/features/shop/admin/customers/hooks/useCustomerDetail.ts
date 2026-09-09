import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getCustomerDetail } from "../services/customerService";
import type { CustomerDetail } from "../types/customer";

export function useCustomerDetail(customerId: string | undefined) {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!shopSlug || !customerId) return;
    setIsLoading(true); setError(null);
    try { setCustomer(await getCustomerDetail(shopSlug, customerId)); }
    catch (requestError) { setError(getApiErrorMessage(requestError, "Unable to load customer details")); }
    finally { setIsLoading(false); }
  }, [customerId, shopSlug]);
  useEffect(() => { void load(); }, [load]);
  return { shopSlug, customer, isLoading, error, refetch: load };
}

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getPaymentDetail } from "../services/paymentService";
import type { Payment } from "../types/payment";

export function usePaymentDetail(shopSlug: string, paymentId: string | null) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!shopSlug || !paymentId) { setPayment(null); return; }
    setIsLoading(true); setError(null);
    try { setPayment(await getPaymentDetail(shopSlug, paymentId)); }
    catch (requestError) { setError(getApiErrorMessage(requestError, "Unable to load payment details")); }
    finally { setIsLoading(false); }
  }, [paymentId, shopSlug]);
  useEffect(() => { void load(); }, [load]);
  return { payment, isLoading, error, refetch: load };
}

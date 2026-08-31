import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getAppointmentPayment } from "../services/paymentService";
import type { AppointmentPayment } from "../types/payment";

export function useAppointmentPayment(shopSlug: string, appointmentId: string | null) {
  const [payment, setPayment] = useState<AppointmentPayment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const refetch = useCallback(async () => {
    const currentRequest = ++requestId.current;
    if (!shopSlug || !appointmentId) {
      setPayment(null);
      setError(null);
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAppointmentPayment(shopSlug, appointmentId);
      if (currentRequest === requestId.current) setPayment(result);
      return result;
    } catch (requestError) {
      if (currentRequest === requestId.current) {
        setError(getApiErrorMessage(requestError, "Unable to load payment status"));
      }
      return null;
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [appointmentId, shopSlug]);

  useEffect(() => {
    void refetch();
    return () => { requestId.current += 1; };
  }, [refetch]);

  return { payment, isLoading, error, refetch };
}

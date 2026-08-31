import { useState } from "react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { confirmAppointmentPayment } from "../services/paymentService";
import type { ConfirmPaymentInput } from "../types/payment";

export function useConfirmPayment(shopSlug: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = async (appointmentId: string, input: ConfirmPaymentInput) => {
    setIsSubmitting(true); setError(null);
    try { await confirmAppointmentPayment(shopSlug, appointmentId, input); return true; }
    catch (requestError) { setError(getApiErrorMessage(requestError, "Unable to confirm payment")); return false; }
    finally { setIsSubmitting(false); }
  };
  return { confirm, isSubmitting, error };
}

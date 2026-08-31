import { useState } from "react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { confirmAppointmentPayment, createAppointmentPayment } from "../services/paymentService";
import type { CreatePaymentInput } from "../types/payment";

export function useCreatePayment(shopSlug: string, errorFallback = "Unable to complete payment") {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAndConfirm = async (appointmentId: string, amount: number, input: CreatePaymentInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createAppointmentPayment(shopSlug, appointmentId, input);
      await confirmAppointmentPayment(shopSlug, appointmentId, {
        paidAmount: amount,
        note: input.note,
      });
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, errorFallback));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmExisting = async (appointmentId: string, amount: number, note?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await confirmAppointmentPayment(shopSlug, appointmentId, { paidAmount: amount, note });
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, errorFallback));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createAndConfirm, confirmExisting, isSubmitting, error };
}

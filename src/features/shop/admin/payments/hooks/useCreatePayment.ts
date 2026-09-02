import { useRef, useState } from "react";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { confirmAppointmentPayment, createAppointmentPayment } from "../services/paymentService";
import type { AppointmentPayment, CreatePaymentInput } from "../types/payment";

export interface PaymentSubmitResult {
  payment: AppointmentPayment;
  alreadyPaid: boolean;
}

export function useCreatePayment(shopSlug: string, errorFallback = "Unable to complete payment") {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const run = async (
    operation: () => Promise<PaymentSubmitResult>,
  ): Promise<PaymentSubmitResult | null> => {
    if (submittingRef.current) return null;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      return await operation();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, errorFallback));
      return null;
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const createAndConfirm = (
    appointmentId: string,
    input: CreatePaymentInput,
  ) =>
    run(async () => {
      const createdPayment = await createAppointmentPayment(
        shopSlug,
        appointmentId,
        input,
      );

      if (createdPayment.status === "PAID") {
        return { payment: createdPayment, alreadyPaid: true };
      }

      const confirmedPayment = await confirmAppointmentPayment(
        shopSlug,
        appointmentId,
        {
          paidAmount: createdPayment.amount,
          note: input.note,
        },
      );
      return { payment: confirmedPayment, alreadyPaid: false };
    });

  const confirmExisting = (
    appointmentId: string,
    existingPayment: AppointmentPayment,
    note?: string,
  ) =>
    run(async () => {
      const confirmedPayment = await confirmAppointmentPayment(
        shopSlug,
        appointmentId,
        { paidAmount: existingPayment.amount, note },
      );
      return { payment: confirmedPayment, alreadyPaid: false };
    });

  return { createAndConfirm, confirmExisting, isSubmitting, error };
}

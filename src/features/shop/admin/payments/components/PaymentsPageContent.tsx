import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { usePayments } from "../hooks/usePayments";
import { PaymentDetailSheet } from "./PaymentDetailSheet";
import { PaymentFilters } from "./PaymentFilters";
import { PaymentListSkeleton } from "./PaymentListSkeleton";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentTable } from "./PaymentTable";
import { PaymentsHeader } from "./PaymentsHeader";

export function PaymentsPageContent() {
  const { t } = useTranslation("payments");
  const payments = usePayments();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  return (
    <main className="mx-auto w-full max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8">
      <PaymentsHeader />
      <PaymentSummary summary={payments.meta.summary} isLoading={payments.isLoading && !payments.items.length} />
      <PaymentFilters
        draft={payments.draft}
        preset={payments.preset}
        rangeError={payments.rangeError}
        isLoading={payments.isLoading}
        onDraftChange={payments.setDraft}
        onPresetChange={payments.setPreset}
        onApply={payments.applyFilters}
        onClear={payments.clearFilters}
      />
      {payments.error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>{t("loadError")}</AlertTitle>
          <AlertDescription>
            <p>{payments.error}</p>
            <Button className="mt-3" size="sm" variant="outline" onClick={() => void payments.refetch()}>{t("retry")}</Button>
          </AlertDescription>
        </Alert>
      ) : payments.isLoading ? (
        <PaymentListSkeleton />
      ) : (
        <PaymentTable payments={payments.items} meta={payments.meta} onSelect={setSelectedPaymentId} onPageChange={payments.setPage} />
      )}
      <PaymentDetailSheet
        shopSlug={payments.shopSlug}
        paymentId={selectedPaymentId}
        onOpenChange={(open) => { if (!open) setSelectedPaymentId(null); }}
        onPaymentUpdated={payments.refetch}
      />
    </main>
  );
}

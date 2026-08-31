import { useState } from "react";
import { AlertCircle, CreditCard, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";
import type { Appointment } from "../type/appointment";
import { useAppointmentPayment } from "../../payments/hooks/useAppointmentPayment";
import { AppointmentPaymentSheet } from "../../payments/components/AppointmentPaymentSheet";
import { PaymentMethodBadge } from "../../payments/components/PaymentMethodBadge";
import { PaymentStatusBadge } from "../../payments/components/PaymentStatusBadge";
import type { PaymentMethod } from "../../payments/types/payment";
import { formatPaymentDate } from "../../payments/utils/paymentFormatters";

interface Props {
  shopSlug: string;
  appointment: Appointment;
  staffName: string;
  canManage: boolean;
  onAppointmentRefresh: () => Promise<void> | void;
}

export function AppointmentPaymentSection({ shopSlug, appointment, staffName, canManage, onAppointmentRefresh }: Props) {
  const { t, i18n } = useTranslation("payments");
  const [sheetOpen, setSheetOpen] = useState(false);
  const paymentState = useAppointmentPayment(shopSlug, appointment.id);
  const payment = paymentState.payment;
  const isEligible = !["CANCELLED", "NO_SHOW"].includes(appointment.status) && appointment.totalAmount > 0;
  const canComplete = !payment || payment.status === "PENDING" || payment.status === "PARTIAL";

  const handleSuccess = async (method: PaymentMethod) => {
    await Promise.all([paymentState.refetch(), onAppointmentRefresh()]);
    toast.success(t("appointmentFlow.success", {
      amount: formatCurrency(appointment.totalAmount, i18n.language),
      method: t(`methods.${method.toLowerCase()}`),
    }));
  };

  return (
    <section className="mt-5 rounded-xl border bg-card p-4 shadow-xs" aria-labelledby="appointment-payment-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="appointment-payment-heading" className="flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("appointmentFlow.sectionTitle")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("appointmentFlow.sectionDescription")}</p>
        </div>
        {paymentState.isLoading ? <Skeleton className="h-6 w-20" /> : payment ? <PaymentStatusBadge status={payment.status} label={t(`statuses.${payment.status.toLowerCase()}`)} /> : <Badge className="border-border bg-muted text-muted-foreground">{t("appointmentFlow.unpaid")}</Badge>}
      </div>

      {paymentState.error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle aria-hidden="true" />
          <AlertDescription>
            <p>{t("appointmentFlow.loadError")}</p>
            <Button className="mt-2" variant="outline" size="sm" onClick={() => void paymentState.refetch()}><RefreshCw aria-hidden="true" />{t("retry")}</Button>
          </AlertDescription>
        </Alert>
      ) : paymentState.isLoading ? (
        <div className="mt-4 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <Info label={t("detail.amount")} value={formatCurrency(payment?.amount ?? appointment.totalAmount, i18n.language)} />
            <Info label={t("detail.method")} value={payment ? <PaymentMethodBadge method={payment.method} label={t(`methods.${payment.method.toLowerCase()}`)} /> : "—"} />
            {payment?.paidAt ? <Info label={t("detail.paidAt")} value={formatTimestamp(payment.paidAt, i18n.language)} full /> : null}
          </dl>
          {canManage && isEligible && canComplete ? (
            <Button className="mt-4 h-11 w-full" type="button" onClick={() => setSheetOpen(true)}>
              <CreditCard aria-hidden="true" />
              {payment ? t("appointmentFlow.completeAction") : t("appointmentFlow.createAction")}
            </Button>
          ) : null}
          {!isEligible && !payment ? <p className="mt-4 text-xs text-muted-foreground">{t("appointmentFlow.notEligible")}</p> : null}
        </>
      )}

      {canManage && isEligible && canComplete ? (
        <AppointmentPaymentSheet
          key={`${appointment.id}-${payment?.id ?? "new"}`}
          shopSlug={shopSlug}
          appointment={appointment}
          staffName={staffName}
          payment={payment}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onSuccess={handleSuccess}
          onRefresh={paymentState.refetch}
        />
      ) : null}
    </section>
  );
}

function Info({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>;
}

function formatTimestamp(value: string, locale: string) {
  const timestamp = formatPaymentDate(value, locale);
  return `${timestamp.date} · ${timestamp.time}`;
}

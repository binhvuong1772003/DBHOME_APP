import { useState } from "react";
import { AlertCircle, CalendarDays, CreditCard, LoaderCircle, UserRound, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";
import type { Appointment } from "@/features/shop/admin/appointment/type/appointment";
import { useCreatePayment } from "../hooks/useCreatePayment";
import type { AppointmentPayment, PaymentMethod } from "../types/payment";
import { PaymentBreakdown } from "./PaymentBreakdown";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { formatPaymentDate } from "../utils/paymentFormatters";

const methods: PaymentMethod[] = ["CASH", "CARD", "TRANSFER", "MOMO", "VNPAY", "ZALO_PAY"];

interface Props {
  shopSlug: string;
  appointment: Appointment;
  staffName: string;
  payment: AppointmentPayment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (method: PaymentMethod) => Promise<void>;
  onRefresh: () => Promise<AppointmentPayment | null | undefined>;
}

export function AppointmentPaymentSheet({ shopSlug, appointment, staffName, payment, open, onOpenChange, onSuccess, onRefresh }: Props) {
  const { t, i18n } = useTranslation(["payments", "appointment"]);
  const [method, setMethod] = useState<PaymentMethod>(payment?.method ?? "CASH");
  const [note, setNote] = useState(payment?.note ?? "");
  const [validationError, setValidationError] = useState(false);
  const { createAndConfirm, confirmExisting, isSubmitting, error } = useCreatePayment(shopSlug, t("payments:appointmentFlow.submitError"));
  const isExisting = Boolean(payment);

  const submit = async () => {
    if (!appointment.id || appointment.totalAmount <= 0 || !method) {
      setValidationError(true);
      return;
    }
    setValidationError(false);
    const trimmedNote = note.trim() || undefined;
    const succeeded = payment
      ? await confirmExisting(appointment.id, appointment.totalAmount, trimmedNote)
      : await createAndConfirm(appointment.id, appointment.totalAmount, { method, note: trimmedNote });
    if (succeeded) {
      await onSuccess(payment?.method ?? method);
      onOpenChange(false);
      return;
    }
    const currentPayment = await onRefresh();
    if (currentPayment?.status === "PAID") {
      toast.info(t("payments:appointmentFlow.alreadyPaid"));
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!isSubmitting) onOpenChange(next); }}>
      <SheetContent side="right" className="w-full gap-0 overflow-hidden p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-4 pr-14 sm:px-6">
          <SheetTitle>{isExisting ? t("payments:appointmentFlow.completeTitle") : t("payments:appointmentFlow.createTitle")}</SheetTitle>
          <SheetDescription>{t("payments:appointmentFlow.description")}</SheetDescription>
          <SheetClose asChild>
            <Button className="absolute right-3 top-2.5 size-11" variant="ghost" disabled={isSubmitting} aria-label={t("payments:appointmentFlow.close")}>
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-5">
            <section className="rounded-lg border bg-muted/25 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <SummaryItem icon={UserRound} label={t("payments:detail.customer")} value={appointment.customer.name} />
                <SummaryItem icon={UserRound} label={t("payments:detail.staff")} value={staffName} />
                <SummaryItem icon={CalendarDays} label={t("payments:detail.appointment")} value={`${formatPaymentDate(appointment.date, i18n.language).date} · ${appointment.startTime}–${appointment.endTime}`} full />
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold">{t("payments:detail.breakdown")}</h2>
              <PaymentBreakdown source={appointment} />
            </section>

            <Separator />

            <Field>
              <FieldLabel htmlFor="appointment-payment-method">{t("payments:appointmentFlow.method")}</FieldLabel>
              {payment ? (
                <div className="flex min-h-11 items-center rounded-md border bg-muted/25 px-3">
                  <PaymentMethodBadge method={payment.method} label={t(`payments:methods.${payment.method.toLowerCase()}`)} />
                </div>
              ) : (
                <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)} disabled={isSubmitting}>
                  <SelectTrigger id="appointment-payment-method" className="h-11 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {methods.map((value) => <SelectItem key={value} value={value}>{t(`payments:methods.${value.toLowerCase()}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="appointment-payment-note">{t("payments:appointmentFlow.note")}</FieldLabel>
              <Textarea id="appointment-payment-note" value={note} disabled={isSubmitting} placeholder={t("payments:appointmentFlow.notePlaceholder")} onChange={(event) => setNote(event.target.value)} />
            </Field>

            {validationError ? <FieldError>{t("payments:appointmentFlow.invalid")}</FieldError> : null}
            {error ? <Alert variant="destructive"><AlertCircle aria-hidden="true" /><AlertDescription>{error}</AlertDescription></Alert> : null}
          </div>
        </div>

        <SheetFooter className="border-t bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div><p className="text-xs text-muted-foreground">{t("payments:detail.total")}</p><p className="text-xl font-semibold tabular-nums">{formatCurrency(appointment.totalAmount, i18n.language)}</p></div>
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
            <SheetClose asChild><Button type="button" className="h-11" variant="outline" disabled={isSubmitting}>{t("payments:appointmentFlow.cancel")}</Button></SheetClose>
            <Button type="button" className="h-11 min-w-36" disabled={isSubmitting || appointment.totalAmount <= 0} aria-busy={isSubmitting} onClick={() => void submit()}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <CreditCard aria-hidden="true" />}
              {isSubmitting ? t("payments:appointmentFlow.processing") : t("payments:appointmentFlow.confirm")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SummaryItem({ icon: Icon, label, value, full }: { icon: typeof UserRound; label: string; value: string; full?: boolean }) {
  return <div className={full ? "flex gap-2 sm:col-span-2" : "flex gap-2"}><Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 break-words text-sm font-medium">{value}</p></div></div>;
}

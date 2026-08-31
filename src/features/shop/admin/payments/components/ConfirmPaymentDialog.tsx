import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";
import { useConfirmPayment } from "../hooks/useConfirmPayment";
import type { Payment } from "../types/payment";

interface Props {
  shopSlug: string;
  payment: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void> | void;
}

export function ConfirmPaymentDialog({ shopSlug, payment, open, onOpenChange, onSuccess }: Props) {
  const { t, i18n } = useTranslation("payments");
  const { confirm, isSubmitting, error } = useConfirmPayment(shopSlug);
  const [paidAmount, setPaidAmount] = useState(String(payment.amount));
  const [transactionId, setTransactionId] = useState(payment.transactionId ?? "");
  const [note, setNote] = useState(payment.note ?? "");
  const [validationError, setValidationError] = useState(false);

  const submit = async () => {
    const amount = Number(paidAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > payment.amount) {
      setValidationError(true);
      return;
    }
    setValidationError(false);
    const succeeded = await confirm(payment.appointmentId, {
      paidAmount: amount,
      transactionId: transactionId.trim() || undefined,
      note: note.trim() || undefined,
    });
    if (succeeded) {
      await onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirm.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("confirm.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="text-muted-foreground">{payment.appointment.customer.name}</p>
            <p className="mt-1 font-semibold tabular-nums">{formatCurrency(payment.amount, i18n.language)}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment-paid-amount">{t("confirm.amount")}</Label>
            <Input id="payment-paid-amount" type="number" min="1" max={payment.amount} step="1" value={paidAmount} aria-invalid={validationError} onChange={(event) => setPaidAmount(event.target.value)} />
            {validationError ? <p className="text-sm text-destructive" role="alert">{t("confirm.invalidAmount")}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment-reference">{t("confirm.reference")}</Label>
            <Input id="payment-reference" value={transactionId} placeholder={t("confirm.referencePlaceholder")} onChange={(event) => setTransactionId(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payment-note">{t("confirm.note")}</Label>
            <Textarea id="payment-note" value={note} placeholder={t("confirm.notePlaceholder")} onChange={(event) => setNote(event.target.value)} />
          </div>
          {error ? <Alert variant="destructive"><AlertCircle aria-hidden="true" /><AlertDescription>{error}</AlertDescription></Alert> : null}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>{t("confirm.cancel")}</AlertDialogCancel>
          <Button type="button" disabled={isSubmitting} onClick={() => void submit()}>{isSubmitting ? t("confirm.submitting") : t("confirm.submit")}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (cancelReason: string) => Promise<boolean | void>;
}

export function CancelAppointmentDialog({ open, isSubmitting, onOpenChange, onConfirm }: Props) {
  const { t } = useTranslation("appointment");
  const [reason, setReason] = useState("");
  const [showError, setShowError] = useState(false);

  const validate = () => {
    const valid = reason.trim().length > 0;
    setShowError(!valid);
    return valid;
  };

  const submit = async () => {
    if (!validate()) return;
    try {
      const succeeded = await onConfirm(reason.trim());
      if (succeeded !== false) onOpenChange(false);
    } catch {
      // The mutation hook shows the API error; keep the dialog open for retry.
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => { if (!isSubmitting) onOpenChange(next); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("cancelDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("cancelDialog.description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <Field data-invalid={showError}>
          <FieldLabel htmlFor="appointment-cancel-reason">{t("cancelDialog.reason")}</FieldLabel>
          <Textarea
            id="appointment-cancel-reason"
            value={reason}
            disabled={isSubmitting}
            aria-invalid={showError}
            aria-describedby={showError ? "appointment-cancel-reason-error" : undefined}
            placeholder={t("cancelDialog.placeholder")}
            onBlur={validate}
            onChange={(event) => { setReason(event.target.value); if (showError && event.target.value.trim()) setShowError(false); }}
          />
          {showError ? <FieldError id="appointment-cancel-reason-error">{t("cancelDialog.required")}</FieldError> : null}
        </Field>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>{t("cancelDialog.keep")}</AlertDialogCancel>
          <Button type="button" variant="destructive" disabled={isSubmitting} aria-busy={isSubmitting} onClick={() => void submit()}>
            {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : null}
            {isSubmitting ? t("cancelDialog.processing") : t("cancelDialog.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

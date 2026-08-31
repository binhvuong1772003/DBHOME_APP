import { useState, type FormEvent } from "react";
import dayjs from "dayjs";
import { AlertCircle, CalendarOff, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CreateTimeOffRequestInput } from "../services/timeOffService";
import { useTranslation } from "react-i18next";

interface TimeOffRequestSheetProps {
  onSubmit: (input: CreateTimeOffRequestInput) => Promise<void>;
  isSubmitting: boolean;
  submitError: Error | null;
  onResetError: () => void;
}

export function TimeOffRequestSheet({
  onSubmit,
  isSubmitting,
  submitError,
  onResetError,
}: TimeOffRequestSheetProps) {
  const { t } = useTranslation(["workspace", "common"]);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reasonKey, setReasonKey] = useState("timeOff.reasons.personal");
  const [note, setNote] = useState("");

  const minDate = dayjs().add(1, "day").format("YYYY-MM-DD");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const category = t(reasonKey);
    const reason = note.trim() ? `${category}: ${note.trim()}` : category;

    try {
      await onSubmit({
        offDate: from,
        offDateEnd: to || undefined,
        reason: reason.slice(0, 100),
      });
      setSubmitted(true);
    } catch {
      return;
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setSubmitted(false);
      setFrom("");
      setTo("");
      setReasonKey("timeOff.reasons.personal");
      setNote("");
      onResetError();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="h-11">
          <CalendarOff aria-hidden="true" />
          {t("timeOff.request")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="border-b px-5 py-5 pr-16">
          <SheetTitle>{t("timeOff.title")}</SheetTitle>
          <SheetDescription>{t("timeOff.description")}</SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 size-11" aria-label={t("accessibility.closeTimeOff")}>
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>
        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center" role="status">
            <span className="flex size-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{t("timeOff.successTitle")}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("timeOff.successDescription")}</p>
            <SheetClose asChild>
              <Button className="mt-6 h-11">{t("common:actions.done")}</Button>
            </SheetClose>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <FieldGroup className="p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="time-off-from">{t("timeOff.fromDate")}</FieldLabel>
                  <Input id="time-off-from" type="date" className="h-11" value={from} min={minDate} onChange={(event) => setFrom(event.target.value)} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="time-off-to">{t("timeOff.toDate")}</FieldLabel>
                  <Input id="time-off-to" type="date" className="h-11" value={to} min={from} onChange={(event) => setTo(event.target.value)} />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="time-off-reason">{t("timeOff.reason")}</FieldLabel>
                <Select value={reasonKey} onValueChange={setReasonKey}>
                  <SelectTrigger id="time-off-reason" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timeOff.reasons.personal">{t("timeOff.reasons.personal")}</SelectItem>
                    <SelectItem value="timeOff.reasons.vacation">{t("timeOff.reasons.vacation")}</SelectItem>
                    <SelectItem value="timeOff.reasons.medical">{t("timeOff.reasons.medical")}</SelectItem>
                    <SelectItem value="timeOff.reasons.family">{t("timeOff.reasons.family")}</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="time-off-note">{t("common:labels.note")}</FieldLabel>
                <Textarea id="time-off-note" value={note} maxLength={70} onChange={(event) => setNote(event.target.value)} placeholder={t("timeOff.notePlaceholder")} className="min-h-28" />
                <FieldDescription>{t("timeOff.noteHint")}</FieldDescription>
              </Field>
              {submitError && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{t("timeOff.createError")}</span>
                </div>
              )}
            </FieldGroup>
            <SheetFooter className="mt-auto border-t bg-background p-5">
              <Button type="submit" className="h-11" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                {isSubmitting ? t("timeOff.submitting") : t("timeOff.submit")}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline" className="h-11">{t("common:actions.cancel")}</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

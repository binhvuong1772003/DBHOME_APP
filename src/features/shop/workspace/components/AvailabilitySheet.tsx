import { useState, type FormEvent } from "react";
import { CalendarCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import type { WorkDay } from "../types/workspace";
import { useTranslation } from "react-i18next";

interface AvailabilitySheetProps {
  days: WorkDay[];
  onSave: (days: WorkDay[]) => void;
}

export function AvailabilitySheet({ days, onSave }: AvailabilitySheetProps) {
  const { t } = useTranslation(["workspace", "common"]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(days);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(days);
    setOpen(nextOpen);
  };

  const updateDay = (id: string, patch: Partial<WorkDay>) => {
    setDraft((current) => current.map((day) => (day.id === id ? { ...day, ...patch } : day)));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(draft);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="h-11">
          <CalendarCheck aria-hidden="true" />
          {t("workSchedule.updateAvailability")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-5 pr-16">
          <SheetTitle>{t("availability.title")}</SheetTitle>
          <SheetDescription>{t("availability.description")}</SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 size-11" aria-label={t("accessibility.closeAvailability")}>
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <FieldGroup className="gap-3 p-5">
            {draft.map((day) => (
              <Field key={day.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{t(day.weekdayKey)}</p>
                    <FieldDescription>{day.available ? t("availability.available") : t("availability.unavailable")}</FieldDescription>
                  </div>
                  <Switch
                    checked={day.available}
                    onCheckedChange={(available) => updateDay(day.id, { available })}
                    aria-label={t("accessibility.setDayAvailability", { day: t(day.weekdayKey) })}
                  />
                </div>
                {day.available && (
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor={`${day.id}-start`}>{t("availability.startTime")}</FieldLabel>
                      <Input
                        id={`${day.id}-start`}
                        type="time"
                        className="h-11"
                        value={day.startTime}
                        onChange={(event) => updateDay(day.id, { startTime: event.target.value })}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor={`${day.id}-end`}>{t("availability.endTime")}</FieldLabel>
                      <Input
                        id={`${day.id}-end`}
                        type="time"
                        className="h-11"
                        value={day.endTime}
                        onChange={(event) => updateDay(day.id, { endTime: event.target.value })}
                        required
                      />
                    </Field>
                  </div>
                )}
              </Field>
            ))}
          </FieldGroup>
          <SheetFooter className="sticky bottom-0 border-t bg-background p-5">
            <Button type="submit" className="h-11">{t("availability.save")}</Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-11">{t("common:actions.cancel")}</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

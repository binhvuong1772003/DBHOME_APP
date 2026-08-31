import { useMemo, useState } from "react";
import { Clock3, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getStaffName } from "../../staff/constants/staff";
import type { StaffScheduleDay } from "../../staff/types/staff";
import type { StaffWithWeeklySchedule } from "../types/workforce";

interface EditScheduleSheetProps {
  item: StaffWithWeeklySchedule;
  open: boolean;
  isSaving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (staffId: string, schedule: StaffScheduleDay[]) => Promise<boolean>;
}

function createWeek(schedule: StaffScheduleDay[], staffId: string) {
  return Array.from({ length: 7 }, (_, dayOfWeek) =>
    schedule.find((day) => day.dayOfWeek === dayOfWeek) ?? {
      id: `new-${dayOfWeek}`,
      shopStaffId: staffId,
      dayOfWeek,
      startTime: "09:00",
      endTime: "18:00",
      isOff: true,
    },
  );
}

export function EditScheduleSheet({
  item,
  open,
  isSaving,
  onOpenChange,
  onSave,
}: EditScheduleSheetProps) {
  const { t, i18n } = useTranslation(["workforce", "common"]);
  const [days, setDays] = useState<StaffScheduleDay[]>(() =>
    createWeek(item.schedule.schedule, item.staff.id),
  );
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  const invalidDays = useMemo(
    () => new Set(days.filter((day) => !day.isOff && day.endTime <= day.startTime).map((day) => day.dayOfWeek)),
    [days],
  );

  const updateDay = (dayOfWeek: number, changes: Partial<StaffScheduleDay>) => {
    setDays((current) => current.map((day) => day.dayOfWeek === dayOfWeek ? { ...day, ...changes } : day));
  };

  const handleSave = async () => {
    if (invalidDays.size > 0) return;
    if (await onSave(item.staff.id, days)) onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader className="border-b px-6 py-5 pr-14">
          <SheetTitle>{t("schedule.editTitle")}</SheetTitle>
          <SheetDescription>
            {t("schedule.editDescription", { name: getStaffName(item.staff) })}
          </SheetDescription>
        </SheetHeader>
        <SheetClose asChild>
          <Button type="button" variant="ghost" size="icon-sm" className="absolute right-3 top-3 size-11 rounded-full sm:right-4 sm:top-4 sm:size-8" aria-label={t("common:actions.close")}>
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-3">
            {days.map((day) => {
              const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" })
                .format(new Date(Date.UTC(2024, 0, 7 + day.dayOfWeek)));
              const working = !day.isOff;
              const invalid = invalidDays.has(day.dayOfWeek);
              return (
                <fieldset key={day.dayOfWeek} className="rounded-xl border bg-card p-4">
                  <legend className="sr-only">{weekday}</legend>
                  <div className="flex min-h-11 items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold capitalize">{weekday}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {working ? t("schedule.working") : t("schedule.off")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <FieldLabel htmlFor={`working-${day.dayOfWeek}`}>{t("schedule.workingStatus")}</FieldLabel>
                      <Switch
                        id={`working-${day.dayOfWeek}`}
                        checked={working}
                        onCheckedChange={(checked) => updateDay(day.dayOfWeek, { isOff: !checked })}
                        aria-label={`${weekday}: ${t("schedule.workingStatus")}`}
                      />
                    </div>
                  </div>
                  {working && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Field data-invalid={invalid || undefined}>
                        <FieldLabel htmlFor={`start-${day.dayOfWeek}`}>{t("schedule.startTime")}</FieldLabel>
                        <div className="relative">
                          <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                          <Input id={`start-${day.dayOfWeek}`} type="time" value={day.startTime} className="h-11 pl-9" onChange={(event) => updateDay(day.dayOfWeek, { startTime: event.target.value })} />
                        </div>
                      </Field>
                      <Field data-invalid={invalid || undefined}>
                        <FieldLabel htmlFor={`end-${day.dayOfWeek}`}>{t("schedule.endTime")}</FieldLabel>
                        <Input id={`end-${day.dayOfWeek}`} type="time" value={day.endTime} className="h-11" aria-describedby={invalid ? `time-error-${day.dayOfWeek}` : undefined} onChange={(event) => updateDay(day.dayOfWeek, { endTime: event.target.value })} />
                      </Field>
                      {invalid && <FieldError id={`time-error-${day.dayOfWeek}`} className="col-span-2">{t("schedule.invalidTime")}</FieldError>}
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>
        </div>

        <SheetFooter className="border-t bg-background px-6 py-4 sm:flex-row sm:justify-end">
          <SheetClose asChild><Button type="button" variant="outline" className="min-h-11">{t("common:actions.cancel")}</Button></SheetClose>
          <Button type="button" className="min-h-11" disabled={isSaving || invalidDays.size > 0} onClick={() => void handleSave()}>
            {isSaving ? t("schedule.saving") : t("common:actions.saveChanges")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

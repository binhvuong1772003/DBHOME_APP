import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, RefreshCw, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { cn } from "@/lib/utils";
import { getStaffName } from "../constants/staff";
import { getStaffSchedule } from "../services/staffService";
import type { Staff, StaffScheduleResponse } from "../types/staff";

interface StaffScheduleSheetProps {
  staff: Staff | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffScheduleSheet({ staff, open, onOpenChange }: StaffScheduleSheetProps) {
  const { t, i18n } = useTranslation("staff");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [data, setData] = useState<StaffScheduleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  const loadSchedule = useCallback(async () => {
    if (!open || !shopSlug || !staff) return;
    setIsLoading(true);
    setError(null);
    try {
      setData(await getStaffSchedule(shopSlug, staff.id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t("schedule.loadError")));
    } finally {
      setIsLoading(false);
    }
  }, [open, shopSlug, staff, t]);

  useEffect(() => {
    setData(null);
    void loadSchedule();
  }, [loadSchedule]);

  const scheduleByDay = useMemo(
    () => new Map(data?.schedule.map((item) => [item.dayOfWeek, item]) ?? []),
    [data],
  );

  if (!staff) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-5 pr-14">
          <SheetTitle>{t("schedule.title")}</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {t("schedule.description", { name: getStaffName(staff) })}
          </p>
        </SheetHeader>
        <SheetClose asChild>
          <Button type="button" variant="ghost" size="icon-sm" className="absolute right-4 top-4 rounded-full" aria-label={t("schedule.closeLabel")}>
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading && (
            <div className="space-y-3" aria-busy="true">
              {Array.from({ length: 7 }, (_, day) => <Skeleton key={day} className="h-16 w-full rounded-lg" />)}
            </div>
          )}

          {!isLoading && error && (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
              <CalendarDays className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 text-sm font-semibold">{t("schedule.loadError")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button type="button" variant="outline" className="mt-5" onClick={() => void loadSchedule()}>
                <RefreshCw aria-hidden="true" />
                {t("directory.retry")}
              </Button>
            </div>
          )}

          {!isLoading && !error && data && (
            <div className="space-y-3">
              {Array.from({ length: 7 }, (_, dayOfWeek) => {
                const item = scheduleByDay.get(dayOfWeek);
                const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" })
                  .format(new Date(Date.UTC(2024, 0, 7 + dayOfWeek)));
                const isWorking = Boolean(item && !item.isOff);

                return (
                  <div key={dayOfWeek} className={cn("flex min-h-16 items-center justify-between gap-4 rounded-lg border px-4 py-3", isWorking ? "bg-card" : "bg-muted/30 text-muted-foreground")}>
                    <div>
                      <p className="text-sm font-semibold capitalize">{weekday}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {isWorking ? t("schedule.workingDay") : t("schedule.dayOff")}
                      </p>
                    </div>
                    {isWorking && item ? (
                      <div className="flex items-center gap-2 text-sm font-semibold tabular-nums">
                        <Clock3 className="size-4 text-primary" aria-hidden="true" />
                        {item.startTime} – {item.endTime}
                      </div>
                    ) : <span className="text-sm">—</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import { CalendarCheck, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilitySheet } from "@/features/shop/workspace/components/AvailabilitySheet";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { initialWorkWeek } from "@/features/shop/workspace/mock/staff.mock";
import { useTranslation } from "react-i18next";

export function WorkSchedulePage() {
  const { t, i18n } = useTranslation(["workspace", "common"]);
  const [days, setDays] = useState(initialWorkWeek);
  const scheduledDays = days.filter((day) => day.available).length;
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader
        title={t("workSchedule.pageTitle")}
        description={t("workSchedule.pageDescription")}
        actions={<AvailabilitySheet days={days} onSave={setDays} />}
      />
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <Card className="gap-4 py-5 shadow-xs">
          <CardHeader className="px-5 sm:px-6">
            <div className="flex items-start gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <CalendarCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>{t("workSchedule.thisWeek")}</CardTitle>
                <CardDescription className="mt-1">{t("workSchedule.weekSummary", { days: scheduledDays, hours: 36 })}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 xl:grid-cols-7">
            {days.map((day) => (
              <div key={day.id} className={`rounded-xl border p-4 ${day.available ? "bg-card" : "bg-muted/40"}`}>
                <div className="flex items-start justify-between gap-2 lg:block">
                  <div>
                    <p className="text-sm font-semibold">{t(day.weekdayKey)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${day.date}T00:00:00`))}</p>
                  </div>
                  <Badge className={`mt-2 border-transparent lg:w-fit ${day.available ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>
                    {day.available ? t("workSchedule.working") : t("common:status.off")}
                  </Badge>
                </div>
                {day.available && (
                  <p className="mt-4 flex items-center gap-1.5 whitespace-nowrap font-mono text-xs font-semibold tabular-nums">
                    <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
                    {day.startTime}–{day.endTime}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const WorkingHoursPage = WorkSchedulePage;

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { CalendarCheck, CalendarClock, CalendarOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { DateNavigator } from "@/features/shop/workspace/components/DateNavigator";
import { TodaySummary } from "@/features/shop/workspace/components/TodaySummary";
import { TodaySchedule } from "@/features/shop/workspace/components/TodaySchedule";
import { useStaffSchedule } from "@/features/shop/workspace/hooks/useStaffSchedule";
import { useTranslation } from "react-i18next";

function getGreetingKey(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function WorkspacePage() {
  const { t, i18n } = useTranslation("workspace");
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const { appointments, schedule, isLoading, error } = useStaffSchedule(selectedDate);
  const nextAppointment = useMemo(
    () =>
      appointments.find(
        (item) =>
          !["COMPLETED", "CANCELLED", "NO_SHOW"].includes(item.status),
      ),
    [appointments],
  );
  const firstName = user?.name?.split(" ")[0] ?? t("overview.greeting.fallbackName");
  const workingHours = schedule.openTime === "00:00"
    ? t("schedule.notScheduled")
    : `${schedule.openTime} – ${schedule.closeTime}`;
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader
        title={t(`overview.greeting.${getGreetingKey()}`, { name: firstName })}
        description={t("overview.description")}
        actions={<span className="hidden text-sm font-medium text-muted-foreground sm:inline">{new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric" }).format(new Date())}</span>}
      />
      <div className="mx-auto max-w-[1440px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <DateNavigator value={selectedDate} onChange={setSelectedDate} />
        <TodaySummary appointmentCount={appointments.length} workingHours={workingHours} nextAppointment={nextAppointment} />
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <TodaySchedule
            appointments={appointments}
            nextAppointment={nextAppointment}
            isLoading={isLoading}
            hasError={Boolean(error)}
          />
          <aside className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1" aria-label={t("accessibility.upcomingWorkDetails")}>
            <Card className="gap-3 py-4 shadow-xs">
              <CardContent className="flex items-start gap-3 px-4">
                <CalendarCheck className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("overview.tomorrowShift")}</p>
                  <p className="mt-1 text-sm font-semibold">09:00 – 18:00</p>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-3 py-4 shadow-xs">
              <CardContent className="flex items-start gap-3 px-4">
                <CalendarOff className="mt-0.5 size-4 shrink-0 text-chart-3" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("overview.timeOff")}</p>
                  <p className="mt-1 text-sm font-semibold">{t("overview.pendingRequests", { count: 1 })}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-3 py-4 shadow-xs">
              <CardContent className="flex items-start gap-3 px-4">
                <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("overview.thisWeek")}</p>
                  <p className="mt-1 text-sm font-semibold">{t("overview.scheduledHours", { count: 36 })}</p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

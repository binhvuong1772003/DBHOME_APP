import { useState } from "react";
import dayjs from "dayjs";
import { Clock3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateNavigator } from "@/features/shop/workspace/components/DateNavigator";
import { StaffAppointmentCard } from "@/features/shop/workspace/components/StaffAppointmentCard";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { ScheduleEmptyState, ScheduleErrorState, ScheduleLoadingState } from "@/features/shop/workspace/components/WorkspaceStates";
import { useStaffSchedule } from "@/features/shop/workspace/hooks/useStaffSchedule";
import { useTranslation } from "react-i18next";

export function SchedulePage() {
  const { t, i18n } = useTranslation("workspace");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const { appointments, schedule, isLoading, error } = useStaffSchedule(selectedDate);
  const hasHours = schedule.openTime !== "00:00";
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const selectedDateLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(dayjs(selectedDate).toDate());

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader title={t("schedule.pageTitle")} description={t("schedule.pageDescription")} />
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <DateNavigator value={selectedDate} onChange={setSelectedDate} />
        <div className="grid items-start gap-5 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <Card className="gap-4 py-5 shadow-xs">
            <CardHeader className="px-5">
              <CardTitle className="text-sm">{t("schedule.shiftDetails")}</CardTitle>
              <CardDescription>{selectedDateLabel}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-5">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Clock3 className="size-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("schedule.workingHours")}</p>
                  <p className="mt-0.5 text-sm font-semibold tabular-nums">
                    {hasHours ? `${schedule.openTime} – ${schedule.closeTime}` : t("schedule.notScheduled")}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("schedule.appointments")}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{appointments.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-0 overflow-hidden py-0 shadow-xs">
            <CardHeader className="border-b px-5 py-5">
              <CardTitle>{t("schedule.dailyAgenda")}</CardTitle>
              <CardDescription>{t("schedule.dailyAgendaDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              {isLoading ? (
                <ScheduleLoadingState />
              ) : error ? (
                <ScheduleErrorState />
              ) : appointments.length === 0 ? (
                <ScheduleEmptyState />
              ) : (
                <div className="relative space-y-3 before:absolute before:bottom-5 before:left-[2.75rem] before:top-5 before:w-px before:bg-border sm:before:left-[3rem]">
                  {appointments.map((appointment) => (
                    <StaffAppointmentCard key={appointment.id} appointment={appointment} timeline />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

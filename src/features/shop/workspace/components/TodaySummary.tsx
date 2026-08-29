import { CalendarDays, Clock3, LogIn, UserRound } from "lucide-react";
import type { StaffWorkspaceAppointment } from "../types/workspace";
import { useTranslation } from "react-i18next";

interface TodaySummaryProps {
  appointmentCount: number;
  workingHours: string;
  nextAppointment?: StaffWorkspaceAppointment;
}

export function TodaySummary({ appointmentCount, workingHours, nextAppointment }: TodaySummaryProps) {
  const { t } = useTranslation("workspace");
  const items = [
    { label: t("overview.appointments"), value: t("overview.appointmentsValue", { count: appointmentCount }), icon: CalendarDays },
    { label: t("overview.workingHours"), value: workingHours, icon: Clock3 },
    { label: t("overview.attendance"), value: t("overview.checkedInAt", { time: "08:54" }), icon: LogIn },
    { label: t("overview.nextClient"), value: nextAppointment ? t("overview.nextClientValue", { time: nextAppointment.startTime, name: nextAppointment.customerName }) : t("overview.noUpcomingClient"), icon: UserRound },
  ];

  return (
    <section aria-label={t("overview.summaryLabel")} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <item.icon className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-0.5 truncate text-sm font-semibold tabular-nums">{item.value}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

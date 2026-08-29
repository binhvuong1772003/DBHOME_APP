import { CheckCircle2, Clock3, LogIn, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { attendanceHistory } from "@/features/shop/workspace/mock/staff.mock";
import { useTranslation } from "react-i18next";

const statusClass = {
  Working: "bg-secondary/15 text-secondary",
  Completed: "bg-primary/15 text-primary",
  Late: "bg-chart-3/15 text-chart-3",
};

const statusKey = {
  Working: "common:status.working",
  Completed: "common:status.completed",
  Late: "common:status.late",
} as const;

export function AttendancePage() {
  const { t, i18n } = useTranslation(["workspace", "common"]);
  const today = attendanceHistory[0];
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
  const formatWorkedTime = (minutes: number) => t("common:time.hoursMinutes", { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  const summary = [
    { label: t("common:labels.checkIn"), value: today.checkIn, icon: LogIn },
    { label: t("common:labels.checkOut"), value: today.checkOut, icon: LogOut },
    { label: t("attendance.workingTime"), value: formatWorkedTime(today.workedMinutes), icon: Clock3 },
    { label: t("common:labels.status"), value: t(statusKey[today.status]), icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader title={t("attendance.pageTitle")} description={t("attendance.pageDescription")} />
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <section aria-labelledby="attendance-today-title">
          <div className="mb-3">
            <h2 id="attendance-today-title" className="text-base font-semibold">{t("common:time.today")}</h2>
            <p className="text-sm text-muted-foreground">{t("attendance.todaySchedule", { time: "09:00 – 18:00" })}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <Card key={item.label} className="gap-3 py-4 shadow-xs">
                <CardContent className="flex items-center gap-3 px-4">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardHeader className="border-b px-5 py-5">
            <CardTitle>{t("attendance.history")}</CardTitle>
            <CardDescription>{t("attendance.historyDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    {[t("common:labels.date"), t("common:labels.schedule"), t("common:labels.checkIn"), t("common:labels.checkOut"), t("common:labels.worked"), t("common:labels.status")].map((label) => (
                      <th key={label} scope="col" className="px-5 py-3 font-medium">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendanceHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/25">
                      <td className="px-5 py-4 font-medium">{formatDate(record.date)}</td>
                      <td className="px-5 py-4 font-mono text-xs tabular-nums">{record.schedule}</td>
                      <td className="px-5 py-4 font-mono text-xs tabular-nums">{record.checkIn}</td>
                      <td className="px-5 py-4 font-mono text-xs tabular-nums">{record.checkOut}</td>
                      <td className="px-5 py-4 font-medium tabular-nums">{formatWorkedTime(record.workedMinutes)}</td>
                      <td className="px-5 py-4">
                        <Badge className={`border-transparent ${statusClass[record.status]}`}>{t(statusKey[record.status])}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y md:hidden">
              {attendanceHistory.map((record) => (
                <article key={record.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{formatDate(record.date)}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{record.schedule}</p>
                    </div>
                    <Badge className={`border-transparent ${statusClass[record.status]}`}>{t(statusKey[record.status])}</Badge>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
                    <div><dt className="text-muted-foreground">{t("common:labels.checkIn")}</dt><dd className="mt-1 font-medium tabular-nums">{record.checkIn}</dd></div>
                    <div><dt className="text-muted-foreground">{t("common:labels.checkOut")}</dt><dd className="mt-1 font-medium tabular-nums">{record.checkOut}</dd></div>
                    <div><dt className="text-muted-foreground">{t("common:labels.worked")}</dt><dd className="mt-1 font-medium tabular-nums">{formatWorkedTime(record.workedMinutes)}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

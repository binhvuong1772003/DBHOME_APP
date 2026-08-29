import { Clock3, Info, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { currentPayPeriod, paymentHistory } from "@/features/shop/workspace/mock/payroll.mock";
import { useTranslation } from "react-i18next";

export function PayrollPage() {
  const { t, i18n } = useTranslation(["workspace", "common"]);
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const currency = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" });
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
  const formatPeriod = (start: string, end: string) => `${formatDate(start)} – ${formatDate(end)}`;
  const breakdown = [
    { label: t("payroll.baseEarnings"), value: currency.format(currentPayPeriod.baseEarnings) },
    { label: t("payroll.commission"), value: currency.format(currentPayPeriod.commission) },
    { label: t("payroll.tips"), value: currency.format(currentPayPeriod.tips) },
  ];

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader title={t("payroll.pageTitle")} description={t("payroll.pageDescription")} />
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="flex items-start gap-2 rounded-lg border border-chart-3/25 bg-chart-3/10 px-4 py-3 text-sm" role="note">
          <Info className="mt-0.5 size-4 shrink-0 text-chart-3" aria-hidden="true" />
          <p>{t("payroll.sampleNote")}</p>
        </div>
        <Card className="gap-5 py-5 shadow-xs">
          <CardHeader className="px-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardDescription>{t("payroll.currentPeriod")}</CardDescription>
                <CardTitle className="mt-1 text-lg">{formatPeriod(currentPayPeriod.periodStart, currentPayPeriod.periodEnd)}</CardTitle>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-muted-foreground">{t("payroll.estimatedEarnings")}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums text-primary">{currency.format(currentPayPeriod.estimatedEarnings)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {breakdown.map((item) => (
              <div key={item.label} className="rounded-xl border bg-muted/25 p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-lg font-semibold tabular-nums">{item.value}</p>
              </div>
            ))}
            <div className="rounded-xl border bg-muted/25 p-4">
              <p className="text-xs text-muted-foreground">{t("payroll.hoursWorked")}</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold tabular-nums"><Clock3 className="size-4 text-secondary" aria-hidden="true" />{t("common:time.hours", { count: currentPayPeriod.hoursWorked })}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardHeader className="border-b px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <WalletCards className="size-5 text-primary" aria-hidden="true" />
              <div><CardTitle>{t("payroll.history")}</CardTitle><CardDescription className="mt-1">{t("payroll.historyDescription")}</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[7rem_1fr_auto_auto] sm:items-center sm:px-6">
                  <p className="text-sm font-semibold">{formatDate(payment.date)}</p>
                  <p className="row-start-2 text-xs text-muted-foreground sm:row-start-auto sm:text-sm">{formatPeriod(payment.periodStart, payment.periodEnd)}</p>
                  <p className="text-sm font-semibold tabular-nums">{currency.format(payment.amount)}</p>
                  <Badge className="w-fit border-transparent bg-secondary/15 text-secondary">{t("common:status.paid")}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

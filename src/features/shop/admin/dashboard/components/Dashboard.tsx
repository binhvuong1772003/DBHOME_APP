import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Scissors,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentStatusDropdown } from "@/features/shop/admin/appointment/components/AppointmentStatusDropdown";
import { CancelAppointmentDialog } from "@/features/shop/admin/appointment/components/CancelAppointmentDialog";
import {
  appointmentStatusConfig,
  type AppointmentStatus,
} from "@/features/shop/admin/appointment/constants/appointmentStatus";
import { useShopDashBoard } from "@/features/shop/admin/dashboard/hooks/useDashboard";
import { cn } from "@/lib/utils";

const chartConfig = {
  income: {
    label: "revenue",
    color: "var(--primary)",
  },
} as const;

const statusLabelKeys: Record<AppointmentStatus, string> = {
  PENDING: "status.pending",
  CONFIRMED: "status.confirmed",
  IN_PROGRESS: "status.inProgress",
  COMPLETED: "status.completed",
  CANCELLED: "status.cancelled",
  NO_SHOW: "status.noShow",
};

function formatCurrency(value: number | null | undefined, locale: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

function getInitials(name: string | undefined, fallback: string) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || fallback
  );
}

function formatDate(
  value: string | undefined,
  locale: string,
  unavailableLabel: string,
) {
  if (!value) return unavailableLabel;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return unavailableLabel;

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </div>
      {action}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <Card className="gap-4 border-border/80 py-5 shadow-xs transition-shadow hover:shadow-sm">
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums text-foreground">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              iconClassName,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, label }: { status: AppointmentStatus; label: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
        appointmentStatusConfig[status].statusClassName,
      )}
    >
      {label}
    </Badge>
  );
}

export const DashBoard = () => {
  const { t: tDashboard, i18n } = useTranslation("dashboard");
  const { t: tAppointment } = useTranslation("appointment");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const [cancelAppointmentId, setCancelAppointmentId] = useState<string | null>(
    null,
  );
  const {
    newIds,
    clearNew,
    handleAddService,
    handleConfirm,
    handleReject,
    appointments,
    isLoadingAppointments,
    isChanging,
    errorAppointments,
    retryAppointments,
    topCustomers,
    isLoadingTopCustomer,
    errorTopCustomer,
    retryTopCustomer,
    countServices,
    isLoadingCountService,
    errorCountService,
    retryCountService,
    weeklyIncomeByDay,
    isLoadingWeeklyIncome,
    errorWeeklyIncome,
    retryWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
    appointmentDate: requestedAppointmentDate,
    sortApointments,
    handleChangeStatus,
    pendingPayments,
  } = useShopDashBoard();

  const appointmentSummary = useMemo(
    () => ({
      pending: appointments.filter((appointment) => appointment.status === "PENDING")
        .length,
      confirmed: appointments.filter(
        (appointment) => appointment.status === "CONFIRMED",
      ).length,
      completed: appointments.filter(
        (appointment) => appointment.status === "COMPLETED",
      ).length,
    }),
    [appointments],
  );
  const hasAppointmentData = !isLoadingAppointments && !errorAppointments;
  const hasRevenueData = !isLoadingWeeklyIncome && !errorWeeklyIncome;
  const hasServiceData = !isLoadingCountService && !errorCountService;
  const hasAttentionItems =
    appointmentSummary.pending > 0 ||
    (pendingPayments.canViewPayments && (pendingPayments.pendingCount ?? 0) > 0);
  const displayDate = formatDate(
    today?.fullDate ?? requestedAppointmentDate,
    locale,
    tDashboard("dateUnavailable"),
  );

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-[1360px] space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
        <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {tDashboard("eyebrow")}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {tDashboard("title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {tDashboard("description")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            <span>{displayDate}</span>
          </div>
        </header>

        <section aria-labelledby="summary-heading">
          <h2 className="sr-only" id="summary-heading">
            {tDashboard("title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title={tDashboard("summary.weeklyRevenue")}
              value={hasRevenueData ? formatCurrency(weeklyTotal, locale) : "—"}
              description={
                isLoadingWeeklyIncome
                  ? tDashboard("summary.loading")
                  : errorWeeklyIncome
                    ? tDashboard("summary.notAvailable")
                    : weekRange || tDashboard("revenue.periodUnavailable")
              }
              icon={WalletCards}
              iconClassName="bg-primary/10 text-primary"
            />
            <SummaryCard
              title={tDashboard("summary.todayAppointments")}
              value={hasAppointmentData ? formatNumber(appointments.length, locale) : "—"}
              description={
                hasAppointmentData
                  ? tDashboard("summary.appointmentsMeta", {
                      confirmed: appointmentSummary.confirmed,
                      completed: appointmentSummary.completed,
                    })
                  : tDashboard("summary.notAvailable")
              }
              icon={CalendarDays}
              iconClassName="bg-secondary/15 text-secondary-foreground"
            />
            <SummaryCard
              title={tDashboard("summary.pendingConfirmations")}
              value={hasAppointmentData ? formatNumber(appointmentSummary.pending, locale) : "—"}
              description={
                !hasAppointmentData
                  ? tDashboard("summary.notAvailable")
                  : appointmentSummary.pending
                    ? tDashboard("summary.pendingMeta")
                    : tDashboard("summary.noPending")
              }
              icon={Clock3}
              iconClassName="bg-chart-5/15 text-chart-5"
            />
            <SummaryCard
              title={tDashboard("summary.services")}
              value={hasServiceData ? formatNumber(countServices, locale) : "—"}
              description={
                hasServiceData
                  ? tDashboard("summary.servicesMeta")
                  : tDashboard("summary.notAvailable")
              }
              icon={Scissors}
              iconClassName="bg-muted text-muted-foreground"
            />
          </div>
        </section>

        <section
          className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.8fr)]"
          aria-label={tDashboard("appointments.title")}
        >
          <Card className="overflow-hidden border-border/80 shadow-xs">
            <CardHeader className="border-b border-border/70">
              <SectionHeading
                title={tDashboard("appointments.title")}
                description={tDashboard("appointments.description")}
                action={
                  <Button asChild variant="outline" size="sm" className="min-h-11 shrink-0">
                    <Link to="appointments">{tDashboard("appointments.viewAll")}</Link>
                  </Button>
                }
              />
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingAppointments ? (
                <div className="space-y-1 p-4 sm:p-6" aria-label={tDashboard("summary.loading")}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4 rounded-lg p-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="size-10 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  ))}
                </div>
              ) : errorAppointments ? (
                <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                  <AlertTriangle className="size-8 text-destructive" aria-hidden="true" />
                  <p className="font-medium text-foreground">{tDashboard("appointments.error")}</p>
                  <Button variant="outline" className="min-h-11" onClick={() => void retryAppointments()}>
                    <RefreshCw aria-hidden="true" />
                    {tDashboard("appointments.retry")}
                  </Button>
                </div>
              ) : sortApointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                  <CheckCircle2 className="size-8 text-secondary" aria-hidden="true" />
                  <p className="font-medium text-foreground">{tDashboard("appointments.noAppointments")}</p>
                  <p className="text-sm text-muted-foreground">
                    {tDashboard("appointments.noAppointmentsDescription")}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/70">
                  {sortApointments.map((appointment) => {
                    const isPending = appointment.status === "PENDING";
                    const isNew = newIds.has(appointment.id);
                    const statusLabel = tAppointment(statusLabelKeys[appointment.status]);
                    const serviceNames = appointment.services
                      .map((service) => service.serviceName)
                      .join(", ");

                    return (
                      <div
                        key={appointment.id}
                        className={cn(
                          "grid gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-6 lg:grid-cols-[7.5rem_minmax(0,1.25fr)_minmax(0,1.5fr)_auto_auto] lg:items-center",
                          isPending && "bg-chart-5/5",
                          isNew && "animate-blink motion-reduce:animate-none",
                        )}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold tabular-nums text-foreground">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                            {tDashboard("appointments.time")}
                          </span>
                          <Clock3 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span>{appointment.startTime} - {appointment.endTime}</span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={appointment.customer.avatarUrl ?? undefined}
                              alt={tDashboard("appointments.avatarAlt", {
                                name: appointment.customer.name,
                              })}
                            />
                            <AvatarFallback>
                              {getInitials(
                                appointment.customer.name,
                                tDashboard("customerFallback"),
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                              {tDashboard("appointments.customer")}
                            </span>
                            <p className="truncate text-sm font-medium text-foreground">
                              {appointment.customer.name}
                            </p>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                            {tDashboard("appointments.services")}
                          </span>
                          <p className="truncate text-sm text-muted-foreground">
                            {serviceNames || tDashboard("appointments.noServices")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-3 lg:justify-start">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                            {tDashboard("appointments.amount")}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold tabular-nums text-foreground">
                              {formatCurrency(appointment.totalAmount, locale)}
                            </span>
                            <StatusBadge status={appointment.status} label={statusLabel} />
                          </div>
                        </div>
                        <div className="flex items-center justify-start gap-2 lg:justify-end">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground lg:hidden">
                            {tDashboard("appointments.actions")}
                          </span>
                          {isPending ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="min-h-11 text-xs"
                                disabled={isChanging}
                                onClick={() => setCancelAppointmentId(appointment.id)}
                              >
                                {tAppointment("actions.cancel")}
                              </Button>
                              <Button
                                size="sm"
                                className="min-h-11 text-xs"
                                disabled={isChanging}
                                onClick={() => {
                                  clearNew(appointment.id);
                                  void handleConfirm(appointment.id)();
                                }}
                              >
                                {tAppointment("actions.confirm")}
                              </Button>
                            </>
                          ) : (
                            <AppointmentStatusDropdown
                              status={appointment.status}
                              disabled={isChanging}
                              className="min-h-11"
                              onStatusChange={(status) =>
                                handleChangeStatus(appointment.id, status)
                              }
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs">
            <CardHeader>
              <SectionHeading
                title={tDashboard("attention.title")}
                description={tDashboard("attention.description")}
                action={<AlertTriangle className="size-5 text-chart-5" aria-hidden="true" />}
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs leading-5 text-muted-foreground">
                {tDashboard("attention.sourceNote")}
              </p>
              {isLoadingAppointments ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              ) : errorAppointments ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {tDashboard("appointments.error")}
                </div>
              ) : !hasAttentionItems && !pendingPayments.isLoading && !pendingPayments.error ? (
                <div className="rounded-xl border border-dashed border-border p-5">
                  <p className="font-medium text-foreground">{tDashboard("attention.emptyTitle")}</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {tDashboard("attention.emptyDescription")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointmentSummary.pending > 0 ? (
                    <div className="rounded-xl border border-chart-5/30 bg-chart-5/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {tDashboard("attention.pending")}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {tDashboard("attention.pendingDescription")}
                          </p>
                        </div>
                        <span className="text-2xl font-bold tabular-nums text-chart-5">
                          {formatNumber(appointmentSummary.pending, locale)}
                        </span>
                      </div>
                    </div>
                  ) : null}
                  {pendingPayments.isLoading ? (
                    <Skeleton className="h-20 w-full" />
                  ) : pendingPayments.error ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                      <p className="text-sm text-destructive">
                        {tDashboard("attention.paymentError")}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-3 min-h-11"
                        onClick={() => pendingPayments.retry()}
                      >
                        <RefreshCw aria-hidden="true" />
                        {tDashboard("attention.paymentRetry")}
                      </Button>
                    </div>
                  ) : pendingPayments.canViewPayments && (pendingPayments.pendingCount ?? 0) > 0 ? (
                    <div className="rounded-xl border border-chart-5/30 bg-chart-5/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {tDashboard("attention.paymentPending")}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {tDashboard("attention.paymentPendingDescription")}
                          </p>
                        </div>
                        <span className="text-2xl font-bold tabular-nums text-chart-5">
                          {formatNumber(pendingPayments.pendingCount ?? 0, locale)}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
              <Button asChild variant="outline" className="min-h-11 w-full">
                <Link to="appointments">{tDashboard("attention.openAppointments")}</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section
          className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.8fr)]"
          aria-label={tDashboard("revenue.title")}
        >
          <Card className="border-border/80 shadow-xs">
            <CardHeader>
              <SectionHeading
                title={tDashboard("revenue.title")}
                description={tDashboard("revenue.description", {
                  range: weekRange || tDashboard("revenue.periodUnavailable"),
                })}
                action={<WalletCards className="size-5 text-primary" aria-hidden="true" />}
              />
            </CardHeader>
            <CardContent className="h-60 px-4 sm:h-64 sm:px-6">
              {isLoadingWeeklyIncome ? (
                <div className="flex h-full items-end gap-3 px-2 pb-2" aria-label={tDashboard("summary.loading")}>
                  {[48, 72, 56, 86, 64, 80, 60].map((height, index) => (
                    <Skeleton key={index} className="flex-1" style={{ height: `${height}%` }} />
                  ))}
                </div>
              ) : errorWeeklyIncome ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="text-sm text-destructive">{tDashboard("revenue.error")}</p>
                  <Button variant="outline" className="min-h-11" onClick={() => void retryWeeklyIncome()}>
                    <RefreshCw aria-hidden="true" />
                    {tDashboard("revenue.retry")}
                  </Button>
                </div>
              ) : weeklyIncomeByDay.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                  {tDashboard("revenue.empty")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyIncomeByDay} accessibilityLayer>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis hide />
                    <RechartsTooltip
                      cursor={{ fill: "var(--muted)" }}
                      contentStyle={{
                        borderRadius: "var(--radius)",
                        borderColor: "var(--border)",
                        backgroundColor: "var(--popover)",
                        color: "var(--popover-foreground)",
                      }}
                      formatter={(value) => [
                        formatCurrency(Number(value), locale),
                        tDashboard("revenue.tooltip"),
                      ]}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
                    />
                    <Bar
                      dataKey="income"
                      fill={chartConfig.income.color}
                      radius={[5, 5, 0, 0]}
                      maxBarSize={34}
                      name={tDashboard("revenue.tooltip")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.04] shadow-xs">
            <CardHeader>
              <SectionHeading
                title={tDashboard("revenue.todayTitle")}
                description={displayDate}
                action={<CalendarDays className="size-5 text-primary" aria-hidden="true" />}
              />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
                {hasRevenueData ? formatCurrency(today?.income, locale) : "—"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {tDashboard("revenue.todayDescription")}
              </p>
            </CardContent>
            <CardFooter className="border-t border-primary/10 px-6 py-4">
              <span className="text-xs text-muted-foreground">
                {weekRange || tDashboard("revenue.periodUnavailable")}
              </span>
            </CardFooter>
          </Card>
        </section>

        <section
          className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.8fr)]"
          aria-label={tDashboard("customers.title")}
        >
          <Card className="border-border/80 shadow-xs">
            <CardHeader>
              <SectionHeading
                title={tDashboard("customers.title")}
                description={tDashboard("customers.description")}
                action={<UsersRound className="size-5 text-secondary-foreground" aria-hidden="true" />}
              />
            </CardHeader>
            <CardContent>
              {isLoadingTopCustomer ? (
                <div className="space-y-4" aria-label={tDashboard("summary.loading")}>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : errorTopCustomer ? (
                <div className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm text-destructive">{tDashboard("customers.error")}</p>
                  <Button variant="outline" className="min-h-11" onClick={() => void retryTopCustomer()}>
                    <RefreshCw aria-hidden="true" />
                    {tDashboard("customers.retry")}
                  </Button>
                </div>
              ) : topCustomers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  {tDashboard("customers.empty")}
                </div>
              ) : (
                <div className="divide-y divide-border/70">
                  {topCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <Avatar size="lg">
                        <AvatarImage
                          src={customer.avatarUrl ?? undefined}
                          alt={tDashboard("appointments.avatarAlt", { name: customer.name })}
                        />
                        <AvatarFallback>
                          {getInitials(customer.name, tDashboard("customerFallback"))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tDashboard("customers.repeatCustomer")}
                        </p>
                      </div>
                      <p className="text-right text-sm font-semibold tabular-nums text-foreground">
                        <span className="sr-only">{tDashboard("customers.totalSpent")}: </span>
                        {formatCurrency(customer.totalSpent, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs">
            <CardHeader>
              <SectionHeading
                title={tDashboard("services.title")}
                description={tDashboard("services.description")}
                action={<MoreHorizontal className="size-5 text-muted-foreground" aria-hidden="true" />}
              />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/60 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs">
                    <Scissors className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {tDashboard("services.countLabel")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {errorCountService
                        ? tDashboard("services.error")
                        : hasServiceData
                          ? tDashboard("services.description")
                          : tDashboard("summary.loading")}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold tabular-nums text-foreground">
                  {hasServiceData ? formatNumber(countServices, locale) : "—"}
                </span>
              </div>
              {errorCountService ? (
                <Button variant="outline" className="min-h-11 w-full" onClick={() => void retryCountService()}>
                  <RefreshCw aria-hidden="true" />
                  {tDashboard("services.retry")}
                </Button>
              ) : (
                <Button className="min-h-11 w-full" onClick={handleAddService}>
                  <Plus aria-hidden="true" />
                  {tDashboard("services.add")}
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {cancelAppointmentId ? (
        <CancelAppointmentDialog
          open
          isSubmitting={isChanging}
          onOpenChange={(open) => {
            if (!open) setCancelAppointmentId(null);
          }}
          onConfirm={(cancelReason) => handleReject(cancelAppointmentId, cancelReason)()}
        />
      ) : null}
    </main>
  );
};

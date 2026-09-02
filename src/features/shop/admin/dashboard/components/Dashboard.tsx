import { useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AppointmentStatusDropdown } from "@/features/shop/admin/appointment/components/AppointmentStatusDropdown";
import { CancelAppointmentDialog } from "@/features/shop/admin/appointment/components/CancelAppointmentDialog";
import { useShopDashBoard } from "@/features/shop/admin/dashboard/hooks/useDashboard";

const todayMetrics = [
  { label: "Sold", value: "224" },
  { label: "Returns", value: "12" },
  { label: "Picked", value: "210" },
  { label: "In Transit", value: "112" },
];

const chartConfig = {
  income: {
    label: "Doanh thu",
    color: "var(--primary)",
  },
} as const;

function formatCurrency(value: number | null | undefined) {
  return `${(value ?? 0).toLocaleString("vi-VN")} ₫`;
}

function getInitials(name: string | undefined) {
  return (
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "KH"
  );
}

function formatDate(value: string | undefined) {
  if (!value) return "Chưa có dữ liệu ngày";

  return new Date(value).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
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
        <CardTitle className="text-base font-semibold tracking-tight">
          {title}
        </CardTitle>
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
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export const DashBoard = () => {
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
    topCustomers,
    isLoadingTopCustomer,
    errorTopCustomer,
    countServices,
    isLoadingCountService,
    weeklyIncomeByDay,
    isLoadingWeeklyIncome,
    errorWeeklyIncome,
    weeklyTotal,
    weekRange,
    today,
    sortApointments,
    handleChangeStatus,
  } = useShopDashBoard();

  const appointmentSummary = useMemo(
    () => ({
      pending: appointments.filter(
        (appointment) => appointment.status === "PENDING",
      ).length,
      confirmed: appointments.filter(
        (appointment) => appointment.status === "CONFIRMED",
      ).length,
      completed: appointments.filter(
        (appointment) => appointment.status === "COMPLETED",
      ).length,
    }),
    [appointments],
  );

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
        <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Business overview
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tổng quan vận hành
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Nắm nhanh tình hình cửa hàng và các lịch hẹn cần xử lý hôm nay.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span>{formatDate(today?.fullDate)}</span>
          </div>
        </header>

        <section aria-labelledby="summary-heading">
          <div className="sr-only" id="summary-heading">
            Chỉ số tổng quan
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Doanh thu tuần này"
              value={formatCurrency(weeklyTotal)}
              description={weekRange || "Đang cập nhật khoảng thời gian"}
              icon={WalletCards}
              iconClassName="bg-primary/10 text-primary"
            />
            <SummaryCard
              title="Lịch hẹn hôm nay"
              value={appointments.length.toLocaleString("vi-VN")}
              description={`${appointmentSummary.confirmed} đã xác nhận · ${appointmentSummary.completed} đã hoàn tất`}
              icon={CalendarDays}
              iconClassName="bg-secondary/15 text-secondary"
            />
            <SummaryCard
              title="Yêu cầu chờ xác nhận"
              value={appointmentSummary.pending.toLocaleString("vi-VN")}
              description={
                appointmentSummary.pending
                  ? "Cần được xử lý trong hôm nay"
                  : "Không có yêu cầu mới"
              }
              icon={Clock3}
              iconClassName="bg-chart-3/15 text-chart-3"
            />
            <SummaryCard
              title="Dịch vụ đang cung cấp"
              value={
                isLoadingCountService
                  ? "—"
                  : countServices.toLocaleString("vi-VN")
              }
              description="Tổng số dịch vụ đang có tại cửa hàng"
              icon={Scissors}
              iconClassName="bg-chart-4/15 text-chart-4"
            />
          </div>
        </section>

        <section
          className="grid gap-6 xl:grid-cols-5"
          aria-label="Tổng quan doanh thu và cửa hàng"
        >
          <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-gradient-card-start via-gradient-card-mid to-gradient-card-end text-background xl:col-span-2">
            <CardHeader className="gap-1 pb-3">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-lg font-bold text-background/90">
                  Lịch hôm nay
                </CardTitle>
                <Badge className="border-background/20 bg-background/15 text-background">
                  Hôm nay
                </Badge>
              </div>
              <CardDescription className="text-background/65">
                {formatDate(today?.fullDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight tabular-nums text-background sm:text-4xl">
                {formatCurrency(today?.income)}
              </p>
              <p className="mt-1 text-sm text-background/70">
                Doanh thu ghi nhận trong ngày
              </p>
            </CardContent>
            <Separator className="bg-background/20" />
            <CardFooter className="grid grid-cols-2 gap-x-4 gap-y-5 px-6 pt-5 sm:grid-cols-4">
              {todayMetrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-xs text-background/65">
                    {metric.label}
                  </div>
                  <div className="mt-1 text-lg font-bold tabular-nums text-background">
                    {metric.value}
                  </div>
                </div>
              ))}
            </CardFooter>
          </Card>

          <Card className="border-border/80 shadow-xs xl:col-span-3">
            <CardHeader>
              <SectionHeading
                title="Doanh thu tuần"
                description={
                  weekRange || "Theo dõi tổng doanh thu theo từng ngày"
                }
                action={
                  <div className="flex items-center gap-2">
                    <Badge className="border-secondary/20 bg-secondary/10 text-secondary">
                      14% Increase
                    </Badge>
                    <WalletCards
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                }
              />
            </CardHeader>
            <CardContent className="h-56 px-4 sm:h-64 sm:px-6">
              {isLoadingWeeklyIncome ? (
                <div className="flex h-full items-end gap-3 px-2 pb-2">
                  {[48, 72, 56, 86, 64, 80, 60].map((height, index) => (
                    <Skeleton
                      key={index}
                      className="flex-1"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              ) : errorWeeklyIncome ? (
                <div className="flex h-full items-center justify-center text-sm text-destructive">
                  {errorWeeklyIncome}
                </div>
              ) : weeklyIncomeByDay.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Chưa có dữ liệu doanh thu trong tuần này.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyIncomeByDay} accessibilityLayer>
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeDasharray="4 4"
                    />
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
                        formatCurrency(Number(value)),
                        chartConfig.income.label,
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.date ?? ""
                      }
                    />
                    <Bar
                      dataKey="income"
                      fill={chartConfig.income.color}
                      radius={[5, 5, 0, 0]}
                      maxBarSize={34}
                      name={chartConfig.income.label}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>

        <section
          className="grid gap-6 xl:grid-cols-5"
          aria-label="Tổng quan khách hàng và dịch vụ"
        >
          <Card className="border-border/80 shadow-xs xl:col-span-3">
            <CardHeader>
              <SectionHeading
                title="Khách hàng chi tiêu cao"
                description="Những khách hàng có tổng chi tiêu nổi bật"
                action={
                  <UsersRound
                    className="size-5 text-secondary"
                    aria-hidden="true"
                  />
                }
              />
            </CardHeader>
            <CardContent>
              {isLoadingTopCustomer ? (
                <div className="space-y-4">
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
                <p className="text-sm text-destructive">{errorTopCustomer}</p>
              ) : topCustomers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Chưa có dữ liệu khách hàng.
                </div>
              ) : (
                <div className="divide-y divide-border/70">
                  {topCustomers.map((customer) => (
                    <div
                      key={
                        customer.id?.$oid ??
                        customer.id?.toString?.() ??
                        customer.id
                      }
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <Avatar size="lg">
                        <AvatarImage
                          src={customer.avatarUrl ?? undefined}
                          alt={`Ảnh đại diện của ${customer.name}`}
                        />
                        <AvatarFallback>
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Khách hàng thân thiết
                        </p>
                      </div>
                      <p className="text-right text-sm font-semibold tabular-nums text-foreground">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs xl:col-span-2">
            <CardHeader>
              <SectionHeading
                title="Tổng quan cửa hàng"
                description="Các thông tin cần biết để vận hành"
                action={
                  <MoreHorizontal
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                }
              />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-background text-primary shadow-xs">
                    <Scissors className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tổng dịch vụ của Shop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Sẵn sàng cho khách đặt lịch
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold tabular-nums text-foreground">
                  {isLoadingCountService ? "—" : countServices}
                </span>
              </div>
              <Button className="w-full" onClick={handleAddService}>
                <Plus aria-hidden="true" />
                Thêm dịch vụ mới
              </Button>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="appointments-heading">
          <Card className="overflow-hidden border-border/80 shadow-xs">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle
                    id="appointments-heading"
                    className="text-lg font-semibold tracking-tight"
                  >
                    Lịch hẹn hôm nay
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Xem nhanh lịch làm việc và cập nhật trạng thái từng lịch
                    hẹn.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingAppointments ? (
                <div className="space-y-1 p-4 sm:p-6">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-lg p-3"
                    >
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="size-10 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              ) : sortApointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                  <CheckCircle2
                    className="size-8 text-secondary"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground">
                    Hôm nay chưa có lịch hẹn
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lịch hẹn mới sẽ xuất hiện tại đây.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/70">
                  {sortApointments.map((appointment) => {
                    const isPending = appointment.status === "PENDING";
                    const isNew = newIds.has(appointment.id);

                    return (
                      <div
                        key={appointment.id}
                        className={`grid items-center gap-4 px-4 py-4 transition-colors sm:px-6 lg:grid-cols-[7.5rem_minmax(0,1.25fr)_minmax(0,1.5fr)_auto_auto] ${
                          isPending ? "bg-brand-light/60" : "hover:bg-muted/40"
                        } ${isNew ? "animate-blink motion-reduce:animate-none" : ""}`}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold tabular-nums text-foreground">
                          <Clock3
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span>
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={appointment.customer.avatarUrl ?? undefined}
                              alt={`Ảnh đại diện của ${appointment.customer.name}`}
                            />
                            <AvatarFallback>
                              {getInitials(appointment.customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm font-medium text-foreground">
                            {appointment.customer.name}
                          </span>
                        </div>
                        <span className="truncate text-sm text-muted-foreground">
                          {appointment.services
                            .map((service) => service.serviceName)
                            .join(", ") || "Chưa có dịch vụ"}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {formatCurrency(appointment.totalAmount)}
                        </span>
                        <div className="flex items-center justify-start gap-2 lg:justify-end">
                          {isPending ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                disabled={isChanging}
                                onClick={() => {
                                  setCancelAppointmentId(appointment.id);
                                }}
                              >
                                Từ chối
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs"
                                disabled={isChanging}
                                onClick={() => {
                                  clearNew(appointment.id);
                                  void handleConfirm(appointment.id)();
                                }}
                              >
                                Xác nhận
                              </Button>
                            </>
                          ) : (
                            <AppointmentStatusDropdown
                              status={appointment.status}
                              disabled={isChanging}
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
        </section>
        {cancelAppointmentId ? (
          <CancelAppointmentDialog
            open
            isSubmitting={isChanging}
            onOpenChange={(open) => {
              if (!open) setCancelAppointmentId(null);
            }}
            onConfirm={(cancelReason) =>
              handleReject(cancelAppointmentId, cancelReason)()
            }
          />
        ) : null}
      </div>
    </main>
  );
};

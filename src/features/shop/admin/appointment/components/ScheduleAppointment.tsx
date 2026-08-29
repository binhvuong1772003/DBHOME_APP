import type { CSSProperties, ReactNode } from "react";
import { useStaffs } from "@/features/shop/admin/appointment/hooks/useStaffs";
import { useScheduleAppointment } from "../hooks/useScheduleAppointment";
import {
  CalendarDays,
  Check,
  Clock3,
  Mail,
  PackageOpen,
  Phone,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { StaffAvatar } from "../../../../../components/common/UserAvatar";
import { appointmentStatusConfig } from "../constants/appointmentStatus";
import { MiniCalendar } from "./MiniCalendar";
import { AppointmentStatusDropdown } from "@/features/shop/admin/appointment/components/AppointmentStatusDropdown";
import { useTranslation } from "react-i18next";

function AppointmentCard({
  children,
  className,
  style,
  onClick,
}: {
  children: ReactNode;
  className: string;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      style={style}
      className={`absolute inset-x-2 z-10 overflow-hidden rounded-lg border p-2.5 shadow-xs transition-shadow hover:shadow-md ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

const formatVnd = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const getStaffDisplayName = (staff: {
  nickname?: string | null;
  user?: { name?: string | null; email?: string | null } | null;
}) =>
  staff.nickname?.trim() ||
  staff.user?.name?.trim() ||
  staff.user?.email?.split("@")[0] ||
  "Nhân viên";

function ScheduleAppointment() {
  const { t, i18n } = useTranslation("appointment");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const { staffs } = useStaffs();
  const {
    appointments,
    completedAppointments,
    slot,
    workHour,
    openHour,
    selectedAppointment,
    setSelectedAppointment,
    handleAppointmentClick,
    calendarDays,
    mutedList,
    selectedDate,
    setSelectedDate,
    currentMonth,
    handleStatusChange,
    isChangingStatus,
  } = useScheduleAppointment();
  const selectedStaff = staffs.find(
    (staff) => staff.id === selectedAppointment?.staffId,
  );
  const customerInitials = selectedAppointment?.customer.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1920px] space-y-4 px-4 pb-8 md:px-6 xl:px-8">
        <Card className="gap-0 rounded-xl py-0 shadow-xs">
          <CardContent className="flex flex-col gap-3 p-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1 md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                className="h-10 rounded-lg bg-background pl-9"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 md:ml-auto">
              <Select defaultValue="all-staff">
                <SelectTrigger className="h-10 w-full rounded-lg bg-background md:w-[150px]">
                  <UserRound className="size-4" />
                  <SelectValue placeholder={t("filters.staff")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-staff">{t("filters.allStaff")}</SelectItem>
                  {staffs.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {getStaffDisplayName(staff)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="all-services">
                <SelectTrigger className="h-10 w-full rounded-lg bg-background md:w-[160px]">
                  <Sparkles className="size-4" />
                  <SelectValue placeholder={t("filters.service")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-services">{t("filters.allServices")}</SelectItem>
                  <SelectItem value="hair">{t("filters.hair")}</SelectItem>
                  <SelectItem value="nails">{t("filters.nails")}</SelectItem>
                  <SelectItem value="spa">{t("filters.spa")}</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-statuses">
                <SelectTrigger className="h-10 w-full rounded-lg bg-background md:w-[150px]">
                  <Check className="size-4" />
                  <SelectValue placeholder={t("filters.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">{t("filters.allStatuses")}</SelectItem>
                  <SelectItem value="confirmed">{t("status.confirmed")}</SelectItem>
                  <SelectItem value="pending">{t("status.pending")}</SelectItem>
                  <SelectItem value="checked-in">{t("status.inProgress")}</SelectItem>
                  <SelectItem value="completed">{t("status.done")}</SelectItem>
                </SelectContent>
              </Select>
              <Button className="rounded-lg shadow-sm">
                <Plus />
                {t("newAppointment")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid items-start gap-4 md:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden space-y-4 md:block">
            <MiniCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarDays={calendarDays}
              mutedList={mutedList}
              currentMonth={currentMonth}
            />
            <Card className="gap-4 rounded-xl py-5 shadow-xs">
              <CardHeader className="px-5">
                <CardTitle className="text-sm">{t("staff")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-5">
                {staffs.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3">
                    <StaffAvatar
                      initials={getStaffDisplayName(staff).charAt(0).toUpperCase()}
                      avatarUrl={staff.avatarUrl ?? staff.user?.avatarUrl}
                      alt={getStaffDisplayName(staff)}
                      className="size-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {getStaffDisplayName(staff)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("roles.seniorStylist")}
                      </p>
                    </div>
                    <span className="size-2 rounded-full bg-secondary" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="gap-4 rounded-xl py-5 shadow-xs">
              <CardHeader className="px-5">
                <CardTitle className="text-sm">{t("stats.title")}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2 px-5 md:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-1">
                <div className="rounded-xl border border-border bg-muted/35 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      {t("stats.today")}
                    </p>
                    <CalendarDays className="size-4 text-primary" />
                  </div>
                  <p className="mt-2 text-xl font-bold">
                    {appointments.length}
                  </p>
                </div>
                <div className="rounded-xl border border-secondary/25 bg-secondary/10 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      {t("stats.completed")}
                    </p>
                    <Check className="size-4 text-secondary" />
                  </div>
                  <p className="mt-2 text-xl font-bold">
                    {completedAppointments.length}
                  </p>
                </div>
                <div className="rounded-xl border border-chart-3/25 bg-chart-3/10 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      {t("stats.remaining")}
                    </p>
                    <Clock3 className="size-4 text-chart-3" />
                  </div>
                  <p className="mt-2 text-xl font-bold">
                    {appointments.length - completedAppointments.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
          <div className="flex min-w-0 items-start overflow-hidden">
            <Card className="h-[calc(100dvh-10rem)] min-w-0 flex-1 gap-0 overflow-hidden rounded-xl py-0 shadow-xs transition-all duration-300 ease-out">
              <div className="h-full overflow-auto">
                <div className="flex min-h-full min-w-full flex-col">
                  <div
                    className="sticky top-0 z-20 grid shrink-0 border-b border-border bg-card"
                    style={{
                      gridTemplateColumns: `64px repeat(${staffs.length}, minmax(180px, 1fr))`,
                    }}
                  >
                    <div className="flex items-center justify-center border-r border-border text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      GMT+7
                    </div>
                    {staffs.map((staff) => (
                      <div
                        className="flex h-[72px] items-center gap-3 border-r border-border px-4"
                        key={staff.id}
                      >
                        <StaffAvatar
                          initials={getStaffDisplayName(staff).charAt(0).toUpperCase()}
                          avatarUrl={staff.avatarUrl ?? staff.user?.avatarUrl}
                          alt={getStaffDisplayName(staff)}
                          className="size-10"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                          {getStaffDisplayName(staff)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("roles.nailArtist")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="relative grid min-h-[800px] flex-1 bg-card"
                    style={{
                      gridTemplateColumns: `64px repeat(${staffs.length}, minmax(180px, 1fr))`,
                    }}
                  >
                    <div
                      className="grid border-r border-border bg-muted/15"
                      style={{
                        gridTemplateRows: `repeat(${slot.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {slot.map((hour) => (
                        <div
                          key={hour}
                          className="border-b border-border/70 pr-3 pt-2 text-right font-mono text-[11px] text-muted-foreground"
                        >
                          {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                        </div>
                      ))}
                    </div>
                    {staffs.map((staff) => {
                      const staffAppointments = appointments.filter(
                        (appointment) => appointment.staffId === staff.id,
                      );
                      return (
                        <div
                          className="relative grid border-r border-border"
                          style={{
                            gridTemplateRows: `repeat(${slot.length}, minmax(0, 1fr))`,
                          }}
                          key={staff.id}
                        >
                          {slot.map((sl) => (
                            <div
                              key={sl}
                              className="border-b border-border/70 transition-colors hover:bg-muted/35"
                            />
                          ))}
                          {staffAppointments.map((appointment) => {
                            const [startHour, startMinute] =
                              appointment.startTime.split(":").map(Number);
                            const [endHour, endMinute] = appointment.endTime
                              .split(":")
                              .map(Number);

                            const duration =
                              endHour * 60 +
                              endMinute -
                              (startHour * 60 + startMinute);
                            const positionTop =
                              ((startHour - openHour) / workHour) * 100;
                            const height = (duration / 60) * (100 / workHour);
                            const config =
                              appointmentStatusConfig[appointment.status] ??
                              appointmentStatusConfig.PENDING;
                            return (
                              <AppointmentCard
                                key={appointment.id}
                                className={`${config.cardClassName} cursor-pointer transition-opacity hover:opacity-90 active:opacity-80`}
                                style={{
                                  top: `${positionTop}%`,
                                  height: `${height}%`,
                                  minHeight: "32px",
                                }}
                                onClick={() => {
                                  handleAppointmentClick(appointment);
                                }}
                              >
                                <div className="mb-1.5 flex items-start justify-between gap-2">
                                  <p className="truncate text-xs font-semibold">
                                    {appointment.customer.name}
                                  </p>
                                  <span
                                    className={`${config.badgeClassName} rounded-full px-1.5 py-0.5 text-[9px] font-semibold`}
                                  >
                                    {t(config.labelKey)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="truncate text-[11px] text-muted-foreground">
                                    {appointment.services
                                      .map((service) => service.serviceName)
                                      .join(", ")}
                                  </p>
                                  <p
                                    className={`font-mono font-semibold text-[12px] ${config.timeClassName}`}
                                  >
                                    {appointment.startTime} ·{" "}
                                    {t("details.minutes", { count: duration })}
                                  </p>
                                </div>
                              </AppointmentCard>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
            <div
              className={`shrink-0 overflow-hidden transition-[width,margin,transform,opacity] duration-300 ease-out ${
                selectedAppointment
                  ? "ml-4 w-[320px] translate-x-0 opacity-100"
                  : "pointer-events-none ml-0 w-0 translate-x-full opacity-0"
              }`}
            >
              <Card className="relative h-[calc(100dvh-10rem)] w-[320px] gap-0 overflow-y-auto rounded-xl py-0 shadow-xs">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-3 top-3 z-10 rounded-full"
                  aria-label={t("details.close")}
                  onClick={() => setSelectedAppointment(null)}
                >
                  <X className="size-4" />
                </Button>

                <CardHeader className="border-b border-border px-5 py-5 pr-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {t("details.eyebrow")}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <CardTitle className="text-base">
                      {t("details.title")}
                    </CardTitle>
                    {selectedAppointment && (
                      <AppointmentStatusDropdown
                        status={selectedAppointment.status}
                        disabled={isChangingStatus}
                        onStatusChange={handleStatusChange}
                      />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarImage
                        src={
                          selectedAppointment?.customer.avatarUrl ?? undefined
                        }
                        alt={
                          selectedAppointment?.customer.name ??
                          t("details.customer")
                        }
                      />
                      <AvatarFallback className="bg-primary/10 text-base font-bold text-primary">
                        {customerInitials || "KH"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {selectedAppointment?.customer.name}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        #{selectedAppointment?.id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border bg-muted/25 p-3">
                      <p className="text-[11px] text-muted-foreground">
                        {t("details.staff")}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold">
                        {selectedStaff
                          ? getStaffDisplayName(selectedStaff)
                          : t("details.unassigned")}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/25 p-3">
                      <p className="text-[11px] text-muted-foreground">
                        {t("details.date")}
                      </p>
                      <p className="mt-1 text-xs font-semibold">
                        {selectedAppointment
                          ? formatDate(selectedAppointment.date, locale)
                          : "—"}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center justify-between rounded-lg border border-border bg-muted/25 p-3">
                      <div>
                        <p className="text-[11px] text-muted-foreground">
                          {t("details.time")}
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold">
                          {selectedAppointment?.startTime} –{" "}
                          {selectedAppointment?.endTime}
                        </p>
                      </div>
                      <Clock3 className="size-4 text-primary" />
                    </div>
                  </div>

                  <Separator className="my-5" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("details.bookedServices")}
                      </p>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {t("details.items", {
                          count:
                            (selectedAppointment?.services?.length ?? 0) +
                            (selectedAppointment?.packages?.length ?? 0),
                        })}
                      </span>
                    </div>

                    {selectedAppointment?.services?.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-xl border border-border bg-card p-3 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Sparkles className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {service.serviceName}
                              </p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {t("details.minutes", {
                                  count: service.durationMin,
                                })}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold tabular-nums">
                            {formatVnd(service.priceAtBooking, locale)}
                          </span>
                        </div>

                        {service.selectedValues?.length > 0 && (
                          <div className="mt-3 space-y-2 border-t border-border/70 pt-3">
                            {service.selectedValues.map((selectedValue) => (
                              <div
                                key={selectedValue.id}
                                className="flex items-start justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0">
                                  <span className="text-muted-foreground">
                                    {selectedValue.optionValue.option.name}:
                                  </span>{" "}
                                  <span className="font-medium">
                                    {selectedValue.optionValue.name}
                                  </span>
                                </div>
                                {selectedValue.priceAtBooking > 0 && (
                                  <span className="shrink-0 font-medium text-primary tabular-nums">
                                    +
                                    {formatVnd(
                                      selectedValue.priceAtBooking,
                                      locale,
                                    )}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {selectedAppointment?.packages?.map(
                      (appointmentPackage) => (
                        <div
                          key={appointmentPackage.id}
                          className="rounded-xl border border-secondary/30 bg-secondary/5 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 gap-2.5">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                                <PackageOpen className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="truncate text-sm font-semibold">
                                    {appointmentPackage.package.name}
                                  </p>
                                  <span className="rounded-full bg-secondary/15 px-1.5 py-0.5 text-[9px] font-semibold text-secondary">
                                    {t("details.package")}
                                  </span>
                                </div>
                                {appointmentPackage.package.durationMin && (
                                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                                    {t("details.minutes", {
                                      count:
                                        appointmentPackage.package.durationMin,
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="shrink-0 text-xs font-semibold tabular-nums">
                              {formatVnd(
                                appointmentPackage.priceAtBooking,
                                locale,
                              )}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2 border-t border-secondary/20 pt-3">
                            {appointmentPackage.package.items.map((item) => (
                              <div key={item.id} className="text-xs">
                                <p className="font-medium">
                                  {item.service.name}
                                </p>
                                {item.optionValue && (
                                  <p className="mt-0.5 text-muted-foreground">
                                    {item.optionValue.option.name}:{" "}
                                    {item.optionValue.name}
                                  </p>
                                )}
                              </div>
                            ))}
                            {appointmentPackage.addons.map((packageAddon) => (
                              <div
                                key={packageAddon.id}
                                className="flex justify-between gap-2 text-xs"
                              >
                                <span className="text-muted-foreground">
                                  + {packageAddon.addon.name}
                                </span>
                                <span className="font-medium text-secondary tabular-nums">
                                  +{formatVnd(packageAddon.extraPrice, locale)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}

                    {(selectedAppointment?.services?.length ?? 0) === 0 &&
                      (selectedAppointment?.packages?.length ?? 0) === 0 && (
                        <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                          {t("details.noServices")}
                        </div>
                      )}
                  </div>

                  {(selectedAppointment?.addons?.length ?? 0) > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("details.addons")}
                      </p>
                      <div className="space-y-2">
                        {selectedAppointment?.addons.map((appointmentAddon) => (
                          <div
                            key={appointmentAddon.id}
                            className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {appointmentAddon.addon.name}
                              </p>
                              {appointmentAddon.addon.duration && (
                                <p className="text-[11px] text-muted-foreground">
                                  {t("details.additionalMinutes", {
                                    count: appointmentAddon.addon.duration,
                                  })}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 text-xs font-semibold text-primary tabular-nums">
                              +
                              {formatVnd(
                                appointmentAddon.priceAtBooking,
                                locale,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 rounded-xl bg-muted/35 p-3">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t("details.subtotal")}</span>
                        <span className="tabular-nums">
                          {formatVnd(
                            selectedAppointment?.subtotal ?? 0,
                            locale,
                          )}
                        </span>
                      </div>
                      {(selectedAppointment?.discountAmount ?? 0) > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>{t("details.discount")}</span>
                          <span className="tabular-nums">
                            -
                            {formatVnd(
                              selectedAppointment?.discountAmount ?? 0,
                              locale,
                            )}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-sm font-bold">
                        <span>{t("details.total")}</span>
                        <span className="text-primary tabular-nums">
                          {formatVnd(
                            selectedAppointment?.totalAmount ?? 0,
                            locale,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedAppointment?.note && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("details.note")}
                      </p>
                      <div className="mt-2 rounded-lg border border-border bg-muted/25 p-3 text-xs leading-5 text-muted-foreground">
                        {selectedAppointment.note}
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("details.contact")}
                    </p>
                    <div className="mt-3 space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <Phone className="size-4 shrink-0 text-muted-foreground" />
                        <span>
                          {selectedAppointment?.customer.phone ||
                            t("details.noPhone")}
                        </span>
                      </div>
                      {selectedAppointment?.customer.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="size-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">
                            {selectedAppointment.customer.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                {selectedAppointment &&
                  ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(
                    selectedAppointment.status,
                  ) && (
                    <div
                      className={`sticky bottom-0 z-20 grid gap-2 border-t border-border bg-card/95 p-4 backdrop-blur ${
                        selectedAppointment.status === "IN_PROGRESS"
                          ? "grid-cols-1"
                          : "grid-cols-2"
                      }`}
                    >
                      {selectedAppointment.status !== "IN_PROGRESS" && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={isChangingStatus}
                          onClick={() => handleStatusChange("CANCELLED")}
                        >
                          <X aria-hidden="true" />
                          {t("actions.cancel")}
                        </Button>
                      )}

                      {selectedAppointment.status === "PENDING" && (
                        <Button
                          type="button"
                          className="h-10"
                          disabled={isChangingStatus}
                          onClick={() => handleStatusChange("CONFIRMED")}
                        >
                          <Check aria-hidden="true" />
                          {isChangingStatus
                            ? t("actions.processing")
                            : t("actions.confirm")}
                        </Button>
                      )}

                      {selectedAppointment.status === "CONFIRMED" && (
                        <Button
                          type="button"
                          className="h-10"
                          disabled={isChangingStatus}
                          onClick={() => handleStatusChange("IN_PROGRESS")}
                        >
                          <Clock3 aria-hidden="true" />
                          {isChangingStatus
                            ? t("actions.processing")
                            : t("actions.start")}
                        </Button>
                      )}

                      {selectedAppointment.status === "IN_PROGRESS" && (
                        <Button
                          type="button"
                          className="h-10 w-full"
                          disabled={isChangingStatus}
                          onClick={() => handleStatusChange("DONE")}
                        >
                          <Check aria-hidden="true" />
                          {isChangingStatus
                            ? t("actions.processing")
                            : t("actions.complete")}
                        </Button>
                      )}
                    </div>
                  )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { ScheduleAppointment };
export default ScheduleAppointment;

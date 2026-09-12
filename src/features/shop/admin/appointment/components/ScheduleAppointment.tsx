import { useMemo, useState } from "react";
import { useStaffs } from "@/features/shop/admin/appointment/hooks/useStaffs";
import { useScheduleAppointment } from "../hooks/useScheduleAppointment";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
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
import { Skeleton } from "@/components/ui/skeleton";
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
import { useParams } from "react-router-dom";
import { useShopMembership } from "@/features/shop/membership/hooks/useShopMembership";
import { AppointmentPaymentSection } from "./AppointmentPaymentSection";
import { CancelAppointmentDialog } from "./CancelAppointmentDialog";
import { CreateAppointmentDialog } from "./CreateAppointmentDialog";
import { ScheduleGrid } from "./ScheduleGrid";
import { AppointmentDetailSheet } from "./AppointmentDetailSheet";
import { MobileAppointmentList } from "./MobileAppointmentList";
import { useScheduleServices } from "../hooks/useScheduleServices";
import {
} from "../utils/scheduleUtils";

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
  "—";

function ScheduleAppointment() {
  const { t, i18n } = useTranslation("appointment");
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const { membership } = useShopMembership();
  const canManage = membership?.role === "OWNER" || membership?.role === "ADMIN";
  const [cancelOpen, setCancelOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("all-staff");
  const [serviceFilter, setServiceFilter] = useState("all-services");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const { staffs, isLoading: isLoadingStaffs, error: staffError, refetch: refetchStaffs } = useStaffs();
  const { services, isLoading: isLoadingServices, error: serviceError, refetch: refetchServices } = useScheduleServices();
  const {
    appointments,
    selectedAppointment,
    setSelectedAppointment,
    handleAppointmentClick,
    calendarDays,
    mutedList,
    selectedDate,
    setSelectedDate,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth,
    todayDate,
    isWorkDay,
    timezone,
    message,
    isLoading: isLoadingAppointments,
    error: appointmentsError,
    hasValidSchedule,
    openMinutes,
    closeMinutes,
    handleStatusChange,
    isChangingStatus,
    refetchAppointments,
  } = useScheduleAppointment();
  const serviceFilterOptions = useMemo(() => {
    if (services.length > 0) return services;
    const values = new Map<string, string>();
    appointments.forEach((appointment) =>
      appointment.services.forEach((service) => values.set(service.serviceId, service.serviceName)),
    );
    return Array.from(values, ([id, name]) => ({ id, name }));
  }, [appointments, services]);
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return appointments.filter((appointment) => {
      const searchable = [
        appointment.customer.name,
        appointment.customer.phone,
        appointment.customer.email,
        appointment.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const matchesStaff =
        staffFilter === "all-staff" ||
        (staffFilter === "unassigned"
          ? !appointment.staffId || !staffs.some((staff) => staff.id === appointment.staffId)
          : appointment.staffId === staffFilter);
      const matchesService =
        serviceFilter === "all-services" ||
        appointment.services.some((service) => service.serviceId === serviceFilter);
      const matchesStatus =
        statusFilter === "all-statuses" || appointment.status === statusFilter;
      return matchesSearch && matchesStaff && matchesService && matchesStatus;
    });
  }, [appointments, search, serviceFilter, staffFilter, statusFilter, staffs]);
  const hasFilters = Boolean(
    search ||
      staffFilter !== "all-staff" ||
      serviceFilter !== "all-services" ||
      statusFilter !== "all-statuses",
  );
  const unassignedAppointments = filteredAppointments.filter(
    (appointment) =>
      !appointment.staffId || !staffs.some((staff) => staff.id === appointment.staffId),
  );
  const visibleStaffs = useMemo(
    () =>
      staffFilter === "unassigned"
        ? []
        : staffFilter === "all-staff"
          ? staffs
          : staffs.filter((staff) => staff.id === staffFilter),
    [staffFilter, staffs],
  );
  const totalAppointments = filteredAppointments.length;
  const completedCount = filteredAppointments.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length;
  const lanes = useMemo(() => {
    const staffLanes = visibleStaffs.map((staff) => ({
      key: staff.id,
      label: getStaffDisplayName(staff),
      staff,
      appointments: filteredAppointments.filter(
        (appointment) => appointment.staffId === staff.id,
      ),
    }));
    if (unassignedAppointments.length > 0 || staffLanes.length === 0) {
      return [
        {
          key: "unassigned",
          label: t("toolbar.unassignedColumn"),
          staff: undefined,
          appointments: unassignedAppointments,
        },
        ...staffLanes,
      ];
    }
    return staffLanes;
  }, [filteredAppointments, t, unassignedAppointments, visibleStaffs]);
  const staffNames = useMemo(
    () => new Map(staffs.map((staff) => [staff.id, getStaffDisplayName(staff)])),
    [staffs],
  );
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
        <header className="flex flex-col gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {t("stats.today")}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("description")} {selectedDate} · {timezone ? t("toolbar.timezone", { timezone }) : t("calendar.selectDate")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" className="min-h-11" onClick={() => setSelectedDate(todayDate)}>
              {t("toolbar.today")}
            </Button>
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11" aria-label={t("toolbar.previousDay")} onClick={() => {
              const date = new Date(`${selectedDate}T12:00:00`);
              date.setDate(date.getDate() - 1);
              setSelectedDate(date.toLocaleDateString("sv-SE"));
            }}>
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="min-h-11 min-w-11" aria-label={t("toolbar.nextDay")} onClick={() => {
              const date = new Date(`${selectedDate}T12:00:00`);
              date.setDate(date.getDate() + 1);
              setSelectedDate(date.toLocaleDateString("sv-SE"));
            }}>
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button type="button" className="min-h-11" onClick={() => setCreateOpen(true)} disabled={!canManage}>
              <Plus aria-hidden="true" />
              {t("newAppointment")}
            </Button>
          </div>
        </header>

        <Card className="gap-0 rounded-xl py-0 shadow-xs">
          <CardContent className="space-y-3 p-3">
            <div className="grid gap-2 lg:grid-cols-[minmax(16rem,1fr)_repeat(3,minmax(10rem,auto))_auto]">
              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchPlaceholder")} aria-label={t("searchPlaceholder")} className="min-h-11 rounded-lg bg-background pl-9" />
              </div>
              <Select value={staffFilter} onValueChange={setStaffFilter}>
                <SelectTrigger className="min-h-11 w-full rounded-lg bg-background"><UserRound className="size-4" aria-hidden="true" /><SelectValue placeholder={t("filters.staff")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-staff">{t("filters.allStaff")}</SelectItem>
                  <SelectItem value="unassigned">{t("toolbar.unassigned")}</SelectItem>
                  {staffs.map((staff) => <SelectItem key={staff.id} value={staff.id}>{getStaffDisplayName(staff)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="min-h-11 w-full rounded-lg bg-background"><Sparkles className="size-4" aria-hidden="true" /><SelectValue placeholder={t("filters.service")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-services">{t("toolbar.allServices")}</SelectItem>
                  {serviceFilterOptions.map((service) => <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="min-h-11 w-full rounded-lg bg-background"><Check className="size-4" aria-hidden="true" /><SelectValue placeholder={t("filters.status")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">{t("toolbar.allStatuses")}</SelectItem>
                  {(Object.keys(appointmentStatusConfig) as Array<keyof typeof appointmentStatusConfig>).map((status) => <SelectItem key={status} value={status}>{t(appointmentStatusConfig[status].labelKey)}</SelectItem>)}
                </SelectContent>
              </Select>
              {hasFilters ? <Button type="button" variant="ghost" className="min-h-11" onClick={() => { setSearch(""); setStaffFilter("all-staff"); setServiceFilter("all-services"); setStatusFilter("all-statuses"); }}>{t("toolbar.clearFilters")}</Button> : <span />}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{t("toolbar.resultCount", { count: totalAppointments })}</span>
              {isLoadingServices ? <span>{t("toolbar.loadingServices")}</span> : serviceError ? <button type="button" className="text-destructive underline" onClick={() => void refetchServices()}>{t("toolbar.serviceLoadError")}</button> : null}
            </div>
          </CardContent>
        </Card>

        <div className="md:hidden">
          <MiniCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarDays={calendarDays}
            mutedList={mutedList}
            currentMonth={currentMonth}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
          />
        </div>

        <div className="grid items-start gap-4 md:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden space-y-4 md:block">
            <MiniCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarDays={calendarDays}
              mutedList={mutedList}
              currentMonth={currentMonth}
              goToPreviousMonth={goToPreviousMonth}
              goToNextMonth={goToNextMonth}
            />
            <Card className="gap-4 rounded-xl py-5 shadow-xs">
              <CardHeader className="px-5">
                <CardTitle className="text-sm">{t("staff")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-5">
                  {isLoadingStaffs ? (
                    [1, 2, 3].map((item) => <Skeleton key={item} className="h-10 w-full" />)
                  ) : staffError ? (
                    <div className="space-y-2 text-sm text-destructive">
                      <p>{t("toolbar.staffLoadError")}</p>
                      <Button type="button" variant="outline" className="min-h-11" onClick={() => void refetchStaffs()}>{t("toolbar.retry")}</Button>
                    </div>
                  ) : staffs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("toolbar.unassigned")}</p>
                  ) : staffs.map((staff) => (
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
                      <p className="text-xs text-muted-foreground">{t(`roles.${staff.role.toLowerCase()}`, { defaultValue: t("roles.staff") })}</p>
                    </div>
                    <span className="size-2 rounded-full bg-muted-foreground/40" aria-hidden="true" />
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
                    {totalAppointments}
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
                    {completedCount}
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
                    {Math.max(totalAppointments - completedCount - filteredAppointments.filter((appointment) => ["CANCELLED", "NO_SHOW"].includes(appointment.status)).length, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
          <div className="flex min-w-0 items-start overflow-hidden">
            <div className="hidden min-w-0 flex-1 md:block">
              <ScheduleGrid
                lanes={lanes}
                openMinutes={openMinutes}
                closeMinutes={closeMinutes}
                timezone={timezone}
                isLoading={isLoadingAppointments}
                error={appointmentsError}
                isWorkDay={isWorkDay}
                hasValidSchedule={hasValidSchedule}
                message={message}
                hasFilteredResults={filteredAppointments.length > 0}
                hasFilters={hasFilters}
                onRetry={() => void refetchAppointments()}
                onSelect={handleAppointmentClick}
              />
            </div>
            <div className="w-full md:hidden">
              {isLoadingAppointments ? <Card className="space-y-3 p-4">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-28 w-full" />)}</Card> : appointmentsError ? <Card className="space-y-3 p-4"><p className="text-sm text-destructive">{appointmentsError}</p><Button type="button" variant="outline" className="min-h-11" onClick={() => void refetchAppointments()}>{t("toolbar.retry")}</Button></Card> : !isWorkDay || !hasValidSchedule ? <Card className="flex min-h-[20rem] items-center justify-center p-6 text-center"><p className="text-sm font-medium">{isWorkDay ? t("toolbar.noSchedule") : t("toolbar.closed")}</p></Card> : <MobileAppointmentList appointments={filteredAppointments} staffNames={staffNames} hasFilters={hasFilters} onSelect={handleAppointmentClick} />}
            </div>
            <div
              className={`hidden shrink-0 overflow-hidden transition-[width,margin,transform,opacity] duration-300 ease-out md:block ${
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
                        disabled={isChangingStatus || !canManage}
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

                  {selectedAppointment ? (
                    <AppointmentPaymentSection
                      key={selectedAppointment.id}
                      shopSlug={shopSlug}
                      appointment={selectedAppointment}
                      staffName={selectedStaff ? getStaffDisplayName(selectedStaff) : t("details.unassigned")}
                      canManage={canManage}
                      onAppointmentRefresh={refetchAppointments}
                    />
                  ) : null}

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
                          disabled={isChangingStatus || !canManage}
                          onClick={() => setCancelOpen(true)}
                        >
                          <X aria-hidden="true" />
                          {t("actions.cancel")}
                        </Button>
                      )}

                      {selectedAppointment.status === "PENDING" && (
                        <Button
                          type="button"
                          className="h-10"
                          disabled={isChangingStatus || !canManage}
                          onClick={() =>
                            handleStatusChange({ status: "CONFIRMED" })
                          }
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
                          disabled={isChangingStatus || !canManage}
                          onClick={() =>
                            handleStatusChange({ status: "IN_PROGRESS" })
                          }
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
                          disabled={isChangingStatus || !canManage}
                          onClick={() =>
                            handleStatusChange({ status: "COMPLETED" })
                          }
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
      <CreateAppointmentDialog
        shopSlug={shopSlug}
        open={createOpen}
        selectedDate={selectedDate}
        staffs={staffs}
        services={services}
        onOpenChange={setCreateOpen}
        onCreated={async () => {
          await refetchAppointments();
        }}
      />
      <div className="md:hidden">
        <AppointmentDetailSheet
          appointment={selectedAppointment}
          shopSlug={shopSlug}
          staffName={selectedStaff ? getStaffDisplayName(selectedStaff) : t("details.unassigned")}
          canManage={canManage}
          isChanging={isChangingStatus}
          onOpenChange={(open) => { if (!open) setSelectedAppointment(null); }}
          onStatusChange={handleStatusChange}
          onRefresh={refetchAppointments}
        />
      </div>
      {selectedAppointment && cancelOpen ? (
        <CancelAppointmentDialog
          open={cancelOpen}
          isSubmitting={isChangingStatus}
          onOpenChange={setCancelOpen}
          onConfirm={(cancelReason) =>
            handleStatusChange({ status: "CANCELLED", cancelReason })
          }
        />
      ) : null}
    </main>
  );
}

export { ScheduleAppointment };
export default ScheduleAppointment;

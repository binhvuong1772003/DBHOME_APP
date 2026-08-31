import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Pencil, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import dayjs from "@/lib/dayjs";
import "dayjs/locale/en";
import "dayjs/locale/vi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStaffName } from "../../staff/constants/staff";
import { useWeeklyStaffSchedules } from "../hooks/useWeeklyStaffSchedules";
import type { ScheduleStatusFilter, ScheduleView, StaffWithWeeklySchedule } from "../types/workforce";
import { getScheduleForDate, getWeekDates, isApprovedTimeOff } from "../utils/schedule";
import { EditScheduleSheet } from "./EditScheduleSheet";
import { MobileScheduleList, WeeklyScheduleGrid } from "./WeeklyScheduleGrid";

export default function StaffScheduleManagement() {
  const { t, i18n } = useTranslation(["workforce", "common"]);
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const dayjsLocale = locale.startsWith("vi") ? "vi" : "en";
  const [anchorDate, setAnchorDate] = useState(() => dayjs());
  const [view, setView] = useState<ScheduleView>("WEEK");
  const [mobileDateIndex, setMobileDateIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ScheduleStatusFilter>("ALL");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [editingItem, setEditingItem] = useState<StaffWithWeeklySchedule | null>(null);
  const { items, pagination, isLoading, isSaving, error, refetch, saveSchedule } = useWeeklyStaffSchedules(page, debouncedSearch);
  const weekDates = useMemo(() => getWeekDates(anchorDate), [anchorDate]);
  const visibleDates = view === "TODAY" ? [anchorDate.startOf("day")] : weekDates;
  const statusDate = dayjs();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(() => items.filter((item) => {
    const todaySchedule = getScheduleForDate(item.schedule.schedule, statusDate);
    const timeOff = isApprovedTimeOff(item.schedule.offDays, statusDate);
    const state = !todaySchedule ? "UNSCHEDULED" : todaySchedule.isOff || timeOff ? "OFF" : "WORKING";
    return status === "ALL" || state === status;
  }), [items, status, statusDate]);

  const handleSave = async (...args: Parameters<typeof saveSchedule>) => {
    const succeeded = await saveSchedule(...args);
    if (succeeded) toast.success(t("schedule.saveSuccess"));
    else toast.error(t("schedule.saveError"));
    return succeeded;
  };

  return (
    <main className="min-h-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("nav.schedule")}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t("schedule.title")}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("schedule.description")}</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="h-10 w-52"><SelectValue placeholder={t("schedule.staffColumn")} /></SelectTrigger>
              <SelectContent>{items.map((item) => <SelectItem key={item.staff.id} value={item.staff.id}>{getStaffName(item.staff)}</SelectItem>)}</SelectContent>
            </Select>
            <Button type="button" className="h-10" disabled={!selectedStaffId} onClick={() => setEditingItem(items.find((item) => item.staff.id === selectedStaffId) ?? null)}><Pencil aria-hidden="true" />{t("schedule.editSchedule")}</Button>
          </div>
        </header>

        <Alert className="bg-muted/30">
          <CalendarDays aria-hidden="true" />
          <AlertTitle>{t("schedule.operationalNote")}</AlertTitle>
          <AlertDescription>
            <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => navigate(`/shops/${shopSlug}/admin/appointments`)}>{t("schedule.viewAppointments")}</Button>
          </AlertDescription>
        </Alert>

        <section className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-xs xl:flex-row xl:items-center xl:justify-between" aria-label={t("schedule.title")}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-between">
            <Button type="button" variant="outline" size="icon" className="size-11" aria-label={t("schedule.previousWeek")} onClick={() => setAnchorDate((current) => current.subtract(view === "WEEK" ? 7 : 1, "day"))}><ChevronLeft aria-hidden="true" /></Button>
            <div className="min-w-44 text-center">
              <p className="text-sm font-semibold tabular-nums">{view === "WEEK" ? `${weekDates[0].locale(dayjsLocale).format("DD MMM")} – ${weekDates[6].locale(dayjsLocale).format("DD MMM YYYY")}` : anchorDate.locale(dayjsLocale).format("dddd, DD MMM YYYY")}</p>
            </div>
            <Button type="button" variant="outline" size="icon" className="size-11" aria-label={t("schedule.nextWeek")} onClick={() => setAnchorDate((current) => current.add(view === "WEEK" ? 7 : 1, "day"))}><ChevronRight aria-hidden="true" /></Button>
            <Button type="button" variant="ghost" className="h-11 max-sm:w-full" onClick={() => { setAnchorDate(dayjs()); setView("TODAY"); }}>{t("common:time.today")}</Button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex rounded-lg bg-muted p-1">
              <Button type="button" size="sm" className="min-h-11 sm:min-h-8" variant={view === "WEEK" ? "default" : "ghost"} aria-pressed={view === "WEEK"} onClick={() => setView("WEEK")}>{t("schedule.weekView")}</Button>
              <Button type="button" size="sm" className="min-h-11 sm:min-h-8" variant={view === "TODAY" ? "default" : "ghost"} aria-pressed={view === "TODAY"} onClick={() => setView("TODAY")}>{t("schedule.todayView")}</Button>
            </div>
            <div className="relative min-w-52 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="h-11 pl-9 sm:h-10" placeholder={t("schedule.searchPlaceholder")} aria-label={t("schedule.searchPlaceholder")} /></div>
            <Select value={status} onValueChange={(value) => setStatus(value as ScheduleStatusFilter)}>
              <SelectTrigger className="h-11 min-w-40 sm:h-10" aria-label={t("schedule.filterLabel")}><SelectValue /></SelectTrigger>
              <SelectContent>{(["ALL", "WORKING", "OFF", "UNSCHEDULED"] as const).map((value) => <SelectItem key={value} value={value}>{t(`schedule.filters.${value.toLowerCase()}`)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </section>

        {isLoading && <Card className="py-0"><CardContent className="space-y-1 p-1">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)}</CardContent></Card>}
        {!isLoading && error && <Card><CardContent className="flex min-h-52 flex-col items-center justify-center text-center"><p className="font-semibold">{t("schedule.loadError")}</p><p className="mt-2 text-sm text-muted-foreground">{error}</p><Button type="button" variant="outline" className="mt-4" onClick={() => void refetch()}>{t("common:actions.tryAgain")}</Button></CardContent></Card>}
        {!isLoading && !error && filtered.length === 0 && <Card><CardContent className="flex min-h-64 flex-col items-center justify-center text-center"><CalendarDays className="size-9 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 font-semibold">{t("schedule.emptyTitle")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("schedule.emptyDescription")}</p></CardContent></Card>}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            {view === "WEEK" && <div className="flex gap-1 overflow-x-auto pb-1 md:hidden">{weekDates.map((date, index) => <Button key={date.format("YYYY-MM-DD")} type="button" size="sm" variant={mobileDateIndex === index ? "default" : "outline"} className="min-h-11 shrink-0" aria-pressed={mobileDateIndex === index} onClick={() => setMobileDateIndex(index)}>{date.locale(dayjsLocale).format("ddd DD")}</Button>)}</div>}
            <WeeklyScheduleGrid items={filtered} dates={visibleDates} locale={locale} onEdit={setEditingItem} />
            <MobileScheduleList items={filtered} date={view === "WEEK" ? weekDates[mobileDateIndex] : anchorDate} locale={locale} onEdit={setEditingItem} />
          </>
        )}

        {!isLoading && !error && pagination.total > 0 && (
          <nav className="flex items-center justify-between gap-3 border-t pt-4" aria-label={t("staff:directory.pagination")}>
            <p className="text-xs text-muted-foreground">
              {t("staff:directory.page", { page: pagination.page, total: pagination.totalPages })}
            </p>
            <div className="flex items-center gap-1">
              <Button type="button" variant="outline" size="icon" className="size-11 sm:size-9" disabled={pagination.page <= 1} aria-label={t("staff:directory.previous")} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft aria-hidden="true" />
              </Button>
              <span className="min-w-20 text-center text-sm font-medium tabular-nums">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button type="button" variant="outline" size="icon" className="size-11 sm:size-9" disabled={pagination.page >= pagination.totalPages} aria-label={t("staff:directory.next")} onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}>
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          </nav>
        )}
      </div>

      {editingItem && <EditScheduleSheet key={editingItem.staff.id} item={editingItem} open isSaving={isSaving} onOpenChange={(open) => { if (!open) setEditingItem(null); }} onSave={handleSave} />}
    </main>
  );
}

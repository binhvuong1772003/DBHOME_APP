import type dayjs from "dayjs";
import { CalendarOff, Clock3, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getStaffInitials, getStaffName } from "../../staff/constants/staff";
import type { StaffWithWeeklySchedule } from "../types/workforce";
import { calculateWeeklyHours, getScheduleForDate, isApprovedTimeOff } from "../utils/schedule";

interface WeeklyScheduleGridProps {
  items: StaffWithWeeklySchedule[];
  dates: dayjs.Dayjs[];
  locale: string;
  onEdit: (item: StaffWithWeeklySchedule) => void;
}

function ScheduleCell({ item, date, onEdit }: {
  item: StaffWithWeeklySchedule;
  date: dayjs.Dayjs;
  onEdit: () => void;
}) {
  const { t } = useTranslation("workforce");
  const schedule = getScheduleForDate(item.schedule.schedule, date);
  const timeOff = isApprovedTimeOff(item.schedule.offDays, date);
  const working = schedule && !schedule.isOff && !timeOff;
  const label = timeOff
    ? t("schedule.timeOff")
    : schedule
      ? schedule.isOff ? t("schedule.off") : `${schedule.startTime} – ${schedule.endTime}`
      : t("schedule.notScheduled");

  return (
    <button
      type="button"
      className="group flex min-h-16 w-full flex-col justify-center rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors hover:border-border hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${getStaffName(item.staff)}, ${date.format("YYYY-MM-DD")}: ${label}`}
      onClick={onEdit}
    >
      {working ? (
        <>
          <span className="font-mono text-xs font-semibold tabular-nums">{schedule.startTime}</span>
          <span className="mt-0.5 font-mono text-xs text-muted-foreground tabular-nums">{schedule.endTime}</span>
        </>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {timeOff && <CalendarOff className="size-3.5" aria-hidden="true" />}
          {label}
        </span>
      )}
    </button>
  );
}

export function WeeklyScheduleGrid({ items, dates, locale, onEdit }: WeeklyScheduleGridProps) {
  const { t } = useTranslation("workforce");
  const columns = `minmax(220px,1.5fr) repeat(${dates.length},minmax(118px,1fr))`;
  return (
    <div className="hidden overflow-hidden rounded-xl border bg-card shadow-xs md:block">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid border-b bg-muted/35" style={{ gridTemplateColumns: columns }}>
            <div className="sticky left-0 z-10 flex items-center border-r bg-muted px-5 py-3 text-xs font-semibold text-muted-foreground">
              {t("schedule.staffColumn")}
            </div>
            {dates.map((date) => (
              <div key={date.format("YYYY-MM-DD")} className="border-r px-3 py-3 text-center last:border-r-0">
                <p className="text-xs font-semibold capitalize">{date.locale(locale.startsWith("vi") ? "vi" : "en").format("ddd")}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{date.format("DD/MM")}</p>
              </div>
            ))}
          </div>
          {items.map((item) => {
            const avatar = item.staff.avatarUrl ?? item.staff.user?.avatarUrl ?? undefined;
            return (
              <div key={item.staff.id} className="grid border-b last:border-b-0" style={{ gridTemplateColumns: columns }}>
                <div className="sticky left-0 z-10 flex min-h-20 items-center gap-3 border-r bg-card px-5 py-3">
                  <Avatar className="size-10"><AvatarImage src={avatar} alt={getStaffName(item.staff)} /><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{getStaffInitials(item.staff)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{getStaffName(item.staff)}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{t(`staff:roles.${item.staff.role.toLowerCase()}`)}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" />{t("schedule.weeklyHours", { hours: calculateWeeklyHours(item.schedule.schedule) })}</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={t("schedule.editSchedule")} onClick={() => onEdit(item)}><Pencil aria-hidden="true" /></Button>
                </div>
                {dates.map((date) => (
                  <div key={date.format("YYYY-MM-DD")} className="flex items-center border-r p-1.5 last:border-r-0">
                    <ScheduleCell item={item} date={date} onEdit={() => onEdit(item)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MobileScheduleList({ items, date, locale, onEdit }: Omit<WeeklyScheduleGridProps, "dates"> & { date: dayjs.Dayjs }) {
  const { t } = useTranslation("workforce");
  return (
    <div className="space-y-3 md:hidden">
      <div className="rounded-lg border bg-muted/35 px-4 py-3">
        <p className="text-sm font-semibold capitalize">{date.locale(locale.startsWith("vi") ? "vi" : "en").format("dddd, DD/MM")}</p>
      </div>
      {items.map((item) => {
        const schedule = getScheduleForDate(item.schedule.schedule, date);
        const timeOff = isApprovedTimeOff(item.schedule.offDays, date);
        const working = schedule && !schedule.isOff && !timeOff;
        const avatar = item.staff.avatarUrl ?? item.staff.user?.avatarUrl ?? undefined;
        return (
          <div key={item.staff.id} className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <Avatar className="size-11"><AvatarImage src={avatar} alt={getStaffName(item.staff)} /><AvatarFallback className="bg-primary/10 text-primary">{getStaffInitials(item.staff)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{getStaffName(item.staff)}</p><p className="text-xs text-muted-foreground">{t(`staff:roles.${item.staff.role.toLowerCase()}`)}</p></div>
              <Button type="button" variant="outline" size="sm" className="min-h-11" onClick={() => onEdit(item)}><Pencil aria-hidden="true" />{t("schedule.editSchedule")}</Button>
            </div>
            <div className="mt-4 rounded-lg bg-muted/35 px-3 py-3">
              {working ? <p className="flex items-center gap-2 font-mono text-sm font-semibold tabular-nums"><Clock3 className="size-4 text-primary" aria-hidden="true" />{schedule.startTime} – {schedule.endTime}</p> : <p className="flex items-center gap-2 text-sm text-muted-foreground">{timeOff && <CalendarOff className="size-4" aria-hidden="true" />}{timeOff ? t("schedule.timeOff") : schedule ? t("schedule.off") : t("schedule.notScheduled")}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { ArrowLeft, CalendarClock, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStaffInitials, getStaffName } from "../constants/staff";
import type { Staff } from "../types/staff";
import type { AttendanceDisplayRecord } from "../types/staffOperations";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

export function StaffDetailHeader({ staff, today, onBack, onEdit, onEditSchedule }: { staff: Staff; today?: AttendanceDisplayRecord; onBack: () => void; onEdit: () => void; onEditSchedule: () => void }) {
  const { t } = useTranslation(["staffDetail", "staff"]); const name = getStaffName(staff); const avatar = staff.avatarUrl ?? staff.user?.avatarUrl ?? undefined;
  return <header><Button variant="ghost" className="-ml-3" onClick={onBack}><ArrowLeft aria-hidden="true" />{t("back")}</Button><div className="mt-3 flex flex-col gap-5 rounded-xl border bg-card p-4 shadow-xs sm:p-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 items-center gap-4"><Avatar className="size-16"><AvatarImage src={avatar} alt={name} /><AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{getStaffInitials(staff)}</AvatarFallback></Avatar><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-2xl font-bold tracking-tight">{name}</h1><Badge variant="outline">{t(`staff:roles.${staff.role.toLowerCase()}`)}</Badge><Badge className={staff.isActive ? "border-primary/25 bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground"}>{staff.isActive ? t("staff:status.active") : t("staff:status.inactive")}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{staff.user?.email} · STF-{staff.id.slice(-6).toUpperCase()}</p><div className="mt-2 flex flex-wrap items-center gap-2 text-sm"><span className="text-muted-foreground">{t("today.schedule")}:</span><span className="font-medium tabular-nums">{today?.schedule && !today.schedule.isOff ? `${today.schedule.startTime} – ${today.schedule.endTime}` : t("schedule.off")}</span>{today && <AttendanceStatusBadge status={today.status} />}</div></div></div><div className="flex flex-col gap-2 sm:flex-row"><Button variant="outline" className="min-h-11" onClick={onEdit}><Pencil aria-hidden="true" />{t("editStaff")}</Button><Button className="min-h-11" onClick={onEditSchedule}><CalendarClock aria-hidden="true" />{t("editSchedule")}</Button></div></div></header>;
}

import { useState } from "react";
import { CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import dayjs from "@/lib/dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getStaffInitials, getStaffName } from "../../staff/constants/staff";
import { useAdminTimeOffRequests } from "../hooks/useAdminTimeOffRequests";
import type { AdminTimeOffRequest, TimeOffStatusFilter } from "../types/workforce";
import { TimeOffRequestSheet } from "./TimeOffRequestSheet";

const filters: TimeOffStatusFilter[] = ["PENDING", "APPROVED", "REJECTED", "ALL"];

function statusClass(status: AdminTimeOffRequest["status"]) {
  if (status === "APPROVED") return "border-primary/20 bg-primary/10 text-primary";
  if (status === "REJECTED") return "border-destructive/20 bg-destructive/10 text-destructive";
  return "border-chart-3/25 bg-chart-3/10 text-foreground";
}

export default function TimeOffManagement() {
  const { t, i18n } = useTranslation(["workforce", "common", "staff"]);
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const [filter, setFilter] = useState<TimeOffStatusFilter>("PENDING");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminTimeOffRequest | null>(null);
  const { requests, pagination, isLoading, reviewingId, error, refetch, review } = useAdminTimeOffRequests(page, filter);
  const counts = {
    ...pagination.statusCounts,
    ALL: pagination.statusCounts.PENDING + pagination.statusCounts.APPROVED + pagination.statusCounts.REJECTED,
  };

  const handleReview = async (...args: Parameters<typeof review>) => {
    const status = args[1].status;
    const succeeded = await review(...args);
    if (succeeded) toast.success(status === "APPROVED" ? t("timeOff.approveSuccess") : t("timeOff.rejectSuccess"));
    return succeeded;
  };

  const getDateInfo = (request: AdminTimeOffRequest) => {
    const start = dayjs(request.offDate);
    const end = dayjs(request.offDateEnd ?? request.offDate);
    return {
      label: request.offDateEnd ? `${start.toDate().toLocaleDateString(locale)} – ${end.toDate().toLocaleDateString(locale)}` : start.toDate().toLocaleDateString(locale),
      days: Math.max(1, end.startOf("day").diff(start.startOf("day"), "day") + 1),
    };
  };

  const emptyTitle = t(`timeOff.empty${filter[0]}${filter.slice(1).toLowerCase()}`);

  return (
    <main className="min-h-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1500px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("nav.timeOff")}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t("timeOff.title")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("timeOff.description")}</p>
        </header>

        <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1" role="tablist" aria-label={t("timeOff.title")}>
          {filters.map((value) => (
            <Button key={value} type="button" role="tab" size="sm" variant={filter === value ? "default" : "ghost"} className="min-h-11 shrink-0 sm:min-h-8" aria-selected={filter === value} onClick={() => { setFilter(value); setPage(1); }}>
              {t(`timeOff.tabs.${value.toLowerCase()}`)}
              <span className={cn("ml-1 rounded-full px-1.5 py-0.5 text-[10px]", filter === value ? "bg-primary-foreground/20" : "bg-background")}>{counts[value]}</span>
            </Button>
          ))}
        </div>

        {isLoading && <Card className="py-0"><CardContent className="space-y-1 p-1">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-20 w-full" />)}</CardContent></Card>}
        {!isLoading && error && <Card><CardContent className="flex min-h-52 flex-col items-center justify-center text-center"><p className="font-semibold">{t("timeOff.loadError")}</p><p className="mt-2 text-sm text-muted-foreground">{error}</p><Button type="button" variant="outline" className="mt-4" onClick={() => void refetch()}>{t("common:actions.tryAgain")}</Button></CardContent></Card>}
        {!isLoading && !error && requests.length === 0 && <Card><CardContent className="flex min-h-64 flex-col items-center justify-center text-center"><CalendarOff className="size-10 text-muted-foreground" aria-hidden="true" /><h2 className="mt-4 font-semibold">{emptyTitle}</h2><p className="mt-1 text-sm text-muted-foreground">{t("timeOff.emptyDescription")}</p></CardContent></Card>}

        {!isLoading && !error && requests.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-xl border bg-card shadow-xs lg:block">
              <table className="w-full border-collapse text-left">
                <thead className="border-b bg-muted/35"><tr>{["staff", "dates", "duration", "reason", "submitted", "actions"].map((column) => <th key={column} className="px-4 py-3.5 text-xs font-semibold text-muted-foreground">{t(`timeOff.${column}`)}</th>)}</tr></thead>
                <tbody className="divide-y">{requests.map((request) => {
                  const name = getStaffName(request.shopStaff);
                  const avatar = request.shopStaff.avatarUrl ?? request.shopStaff.user?.avatarUrl ?? undefined;
                  const dateInfo = getDateInfo(request);
                  return <tr key={request.id} className="hover:bg-muted/25"><td className="px-4 py-4"><div className="flex items-center gap-3"><Avatar className="size-10"><AvatarImage src={avatar} alt={name} /><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{getStaffInitials(request.shopStaff)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-semibold">{name}</p><p className="text-xs text-muted-foreground">{t(`staff:roles.${request.shopStaff.role.toLowerCase()}`)}</p></div></div></td><td className="px-4 py-4 text-sm font-medium tabular-nums">{dateInfo.label}</td><td className="px-4 py-4 text-sm text-muted-foreground">{t("timeOff.days", { count: dateInfo.days })}</td><td className="max-w-56 px-4 py-4"><p className="truncate text-sm text-muted-foreground">{request.reason || t("timeOff.noReason")}</p></td><td className="px-4 py-4 text-sm text-muted-foreground">{new Date(request.createdAt).toLocaleDateString(locale)}</td><td className="px-4 py-4"><div className="flex items-center justify-end gap-2"><Badge className={statusClass(request.status)}>{t(`common:status.${request.status.toLowerCase()}`)}</Badge><Button type="button" variant="ghost" size="sm" onClick={() => setSelected(request)}>{t("timeOff.review")}<ChevronRight aria-hidden="true" /></Button></div></td></tr>;
                })}</tbody>
              </table>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">{requests.map((request) => {
              const name = getStaffName(request.shopStaff);
              const avatar = request.shopStaff.avatarUrl ?? request.shopStaff.user?.avatarUrl ?? undefined;
              const dateInfo = getDateInfo(request);
              return <Card key={request.id} className="gap-0 py-0 shadow-xs"><CardContent className="p-4"><div className="flex items-start gap-3"><Avatar className="size-11"><AvatarImage src={avatar} alt={name} /><AvatarFallback className="bg-primary/10 text-primary">{getStaffInitials(request.shopStaff)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate font-semibold">{name}</p><p className="text-xs text-muted-foreground">{t(`staff:roles.${request.shopStaff.role.toLowerCase()}`)}</p></div><Badge className={statusClass(request.status)}>{t(`common:status.${request.status.toLowerCase()}`)}</Badge></div><div className="mt-4 rounded-lg bg-muted/35 p-3"><p className="text-sm font-semibold tabular-nums">{dateInfo.label}</p><p className="mt-1 text-xs text-muted-foreground">{t("timeOff.days", { count: dateInfo.days })} · {request.reason || t("timeOff.noReason")}</p></div><Button type="button" variant="outline" className="mt-4 min-h-11 w-full" onClick={() => setSelected(request)}>{t("timeOff.review")}<ChevronRight aria-hidden="true" /></Button></CardContent></Card>;
            })}</div>
          </>
        )}

        {!isLoading && !error && pagination.total > 0 && (
          <nav className="flex items-center justify-between gap-3 border-t pt-4" aria-label={t("staff:directory.pagination")}>
            <p className="text-xs text-muted-foreground">{t("staff:directory.page", { page: pagination.page, total: pagination.totalPages })}</p>
            <div className="flex items-center gap-1">
              <Button type="button" variant="outline" size="icon" className="size-11 sm:size-9" disabled={pagination.page <= 1} aria-label={t("staff:directory.previous")} onClick={() => setPage(Math.max(1, pagination.page - 1))}><ChevronLeft aria-hidden="true" /></Button>
              <span className="min-w-20 text-center text-sm font-medium tabular-nums">{pagination.page} / {pagination.totalPages}</span>
              <Button type="button" variant="outline" size="icon" className="size-11 sm:size-9" disabled={pagination.page >= pagination.totalPages} aria-label={t("staff:directory.next")} onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}><ChevronRight aria-hidden="true" /></Button>
            </div>
          </nav>
        )}
      </div>

      {selected && <TimeOffRequestSheet key={selected.id} request={selected} open isReviewing={reviewingId === selected.id} onOpenChange={(open) => { if (!open) setSelected(null); }} onReview={handleReview} />}
    </main>
  );
}

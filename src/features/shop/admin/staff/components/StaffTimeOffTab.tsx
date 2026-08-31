import { useState } from "react";
import { CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import dayjs from "@/lib/dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  AdminTimeOffRequest,
  TimeOffPagination,
  TimeOffStatusFilter,
} from "../../workforce/types/workforce";
import { TimeOffRequestSheet } from "../../workforce/components/TimeOffRequestSheet";

const filters: TimeOffStatusFilter[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function statusClass(status: AdminTimeOffRequest["status"]) {
  if (status === "APPROVED") return "border-primary/20 bg-primary/10 text-primary";
  if (status === "REJECTED") return "border-destructive/20 bg-destructive/10 text-destructive";
  return "border-chart-3/25 bg-chart-3/10 text-foreground";
}

interface StaffTimeOffTabProps {
  requests: AdminTimeOffRequest[];
  meta: TimeOffPagination;
  page: number;
  setPage: (page: number) => void;
  status: TimeOffStatusFilter;
  setStatus: (status: TimeOffStatusFilter) => void;
  loading: boolean;
  reviewingId: string | null;
  locale: string;
  onReview: (
    requestId: string,
    input: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
  ) => Promise<boolean>;
}

export function StaffTimeOffTab({
  requests,
  meta,
  page,
  setPage,
  status,
  setStatus,
  loading,
  reviewingId,
  locale,
  onReview,
}: StaffTimeOffTabProps) {
  const { t } = useTranslation("staffDetail");
  const [selected, setSelected] = useState<AdminTimeOffRequest | null>(null);
  const counts = {
    ...meta.statusCounts,
    ALL: meta.statusCounts.PENDING + meta.statusCounts.APPROVED + meta.statusCounts.REJECTED,
  };

  const getDateInfo = (request: AdminTimeOffRequest) => {
    const start = dayjs(request.offDate);
    const end = dayjs(request.offDateEnd ?? request.offDate);
    return {
      label: request.offDateEnd
        ? `${start.toDate().toLocaleDateString(locale)} – ${end.toDate().toLocaleDateString(locale)}`
        : start.toDate().toLocaleDateString(locale),
      days: Math.max(1, end.startOf("day").diff(start.startOf("day"), "day") + 1),
    };
  };

  const statusLabel = (value: AdminTimeOffRequest["status"]) =>
    t(`timeOff.${value.toLowerCase()}`);

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold">{t("timeOff.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("timeOff.description")}</p>
      </header>

      <div
        className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1"
        role="tablist"
        aria-label={t("timeOff.title")}
      >
        {filters.map((value) => (
          <Button
            key={value}
            type="button"
            role="tab"
            size="sm"
            variant={status === value ? "default" : "ghost"}
            className="min-h-11 shrink-0 sm:min-h-8"
            aria-selected={status === value}
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
          >
            {t(`timeOff.${value.toLowerCase()}`)}
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                status === value ? "bg-primary-foreground/20" : "bg-background",
              )}
            >
              {counts[value]}
            </span>
          </Button>
        ))}
      </div>

      {loading && (
        <Card className="py-0">
          <CardContent className="space-y-1 p-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && requests.length === 0 && (
        <Card>
          <CardContent className="flex min-h-56 flex-col items-center justify-center text-center">
            <CalendarOff className="size-9 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 font-semibold">{t("timeOff.empty")}</p>
          </CardContent>
        </Card>
      )}

      {!loading && requests.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card shadow-xs lg:block">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/35">
                <tr>
                  {[
                    t("timeOff.dates"),
                    t("timeOff.duration"),
                    t("timeOff.reason"),
                    t("timeOff.submitted"),
                    t("timeOff.status"),
                    t("timeOff.view"),
                  ].map((label) => (
                    <th key={label} className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {requests.map((request) => {
                  const dateInfo = getDateInfo(request);
                  return (
                    <tr key={request.id} className="hover:bg-muted/25">
                      <td className="px-4 py-3 text-sm font-medium tabular-nums">{dateInfo.label}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {t("timeOff.days", { count: dateInfo.days })}
                      </td>
                      <td className="max-w-64 px-4 py-3">
                        <p className="truncate text-sm text-muted-foreground">{request.reason || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                        {new Date(request.createdAt).toLocaleDateString(locale)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusClass(request.status)}>{statusLabel(request.status)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(request)}>
                          {t("timeOff.view")}
                          <ChevronRight aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {requests.map((request) => {
              const dateInfo = getDateInfo(request);
              return (
                <Card key={request.id} className="gap-0 py-0 shadow-xs">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tabular-nums">{dateInfo.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t("timeOff.days", { count: dateInfo.days })}
                        </p>
                      </div>
                      <Badge className={statusClass(request.status)}>{statusLabel(request.status)}</Badge>
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{request.reason || "—"}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 min-h-11 w-full"
                      onClick={() => setSelected(request)}
                    >
                      {t("timeOff.view")}
                      <ChevronRight aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {!loading && meta.total > 0 && (
        <nav className="flex items-center justify-between gap-3 border-t pt-4" aria-label={t("timeOff.title")}>
          <span className="text-xs text-muted-foreground tabular-nums">
            {page} / {meta.totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 sm:size-9"
              disabled={page <= 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              <ChevronLeft aria-hidden="true" />
              <span className="sr-only">{t("schedule.previous")}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 sm:size-9"
              disabled={page >= meta.totalPages}
              onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
            >
              <ChevronRight aria-hidden="true" />
              <span className="sr-only">{t("schedule.next")}</span>
            </Button>
          </div>
        </nav>
      )}

      {selected && (
        <TimeOffRequestSheet
          key={selected.id}
          request={selected}
          open
          isReviewing={reviewingId === selected.id}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
          onReview={onReview}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { CalendarOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeOffRequestSheet } from "@/features/shop/workspace/components/TimeOffRequestSheet";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { initialTimeOffRequests } from "@/features/shop/workspace/mock/staff.mock";
import type { TimeOffRequest } from "@/features/shop/workspace/types/workspace";
import { useTranslation } from "react-i18next";

const statusClass = {
  Pending: "bg-chart-3/15 text-chart-3",
  Approved: "bg-secondary/15 text-secondary",
  Rejected: "bg-destructive/15 text-destructive",
};

const statusKey = {
  Pending: "common:status.pending",
  Approved: "common:status.approved",
  Rejected: "common:status.rejected",
} as const;

export function TimeOffPage() {
  const { t, i18n } = useTranslation(["workspace", "common"]);
  const [requests, setRequests] = useState<TimeOffRequest[]>(initialTimeOffRequests);
  const addRequest = (request: TimeOffRequest) => setRequests((current) => [request, ...current]);
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader
        title={t("timeOff.pageTitle")}
        description={t("timeOff.pageDescription")}
        actions={<TimeOffRequestSheet onSubmit={addRequest} />}
      />
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardHeader className="border-b px-5 py-5 sm:px-6">
            <CardTitle>{t("timeOff.myRequests")}</CardTitle>
            <CardDescription>{t("timeOff.requestsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <CalendarOff className="size-6 text-muted-foreground" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{t("timeOff.emptyTitle")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("timeOff.emptyDescription")}</p>
              </div>
            ) : (
              <div className="divide-y">
                {requests.map((request) => (
                  <article key={request.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarOff className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{formatDate(request.from)}{request.to ? ` – ${formatDate(request.to)}` : ""}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{t(request.reasonKey)}</p>
                        {request.note && <p className="mt-2 text-xs text-muted-foreground">{request.note}</p>}
                      </div>
                    </div>
                    <Badge className={`w-fit border-transparent ${statusClass[request.status]}`}>{t(statusKey[request.status])}</Badge>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

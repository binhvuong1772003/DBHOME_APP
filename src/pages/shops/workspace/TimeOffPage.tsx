import { AlertCircle, CalendarOff, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeOffRequestSheet } from "@/features/shop/workspace/components/TimeOffRequestSheet";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { useTimeOffRequests } from "@/features/shop/workspace/hooks/useTimeOffRequests";

const statusClass = {
  PENDING: "bg-chart-3/15 text-chart-3",
  APPROVED: "bg-secondary/15 text-secondary",
  REJECTED: "bg-destructive/15 text-destructive",
};

const statusKey = {
  PENDING: "common:status.pending",
  APPROVED: "common:status.approved",
  REJECTED: "common:status.rejected",
} as const;

export function TimeOffPage() {
  const { t, i18n } = useTranslation(["workspace", "common"]);
  const {
    requests,
    isLoading,
    error,
    refetch,
    submitRequest,
    isCreating,
    createError,
    clearCreateError,
  } = useTimeOffRequests();
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const formatDate = (value: string) => {
    const dateKey = value.includes("T") ? value.slice(0, 10) : value;
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    }).format(new Date(`${dateKey}T00:00:00`));
  };

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader
        title={t("timeOff.pageTitle")}
        description={t("timeOff.pageDescription")}
        actions={
          <TimeOffRequestSheet
            onSubmit={submitRequest}
            isSubmitting={isCreating}
            submitError={createError}
            onResetError={clearCreateError}
          />
        }
      />
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardHeader className="border-b px-5 py-5 sm:px-6">
            <CardTitle>{t("timeOff.myRequests")}</CardTitle>
            <CardDescription>{t("timeOff.requestsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-5 sm:p-6" role="status">
                {["one", "two", "three"].map((id) => (
                  <div key={id} className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56 max-w-full" />
                    </div>
                  </div>
                ))}
                <span className="sr-only">{t("timeOff.loading")}</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <AlertCircle
                  className="size-6 text-destructive"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-semibold">
                  {t("timeOff.loadErrorTitle")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("timeOff.loadErrorDescription")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => void refetch()}
                >
                  <RefreshCw aria-hidden="true" />
                  {t("common:actions.tryAgain")}
                </Button>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <CalendarOff
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-semibold">{t("timeOff.emptyTitle")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("timeOff.emptyDescription")}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {requests.map((request) => (
                  <article
                    key={request.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <CalendarOff className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          {formatDate(request.offDate)}
                          {request.offDateEnd
                            ? ` – ${formatDate(request.offDateEnd)}`
                            : ""}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {request.reason || t("timeOff.reasons.personal")}
                        </p>
                        {request.rejectReason && (
                          <p className="mt-2 text-xs text-destructive">
                            {request.rejectReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={`w-fit border-transparent ${statusClass[request.status]}`}
                    >
                      {t(statusKey[request.status])}
                    </Badge>
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

import { AlertCircle, CalendarX2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export function ScheduleLoadingState() {
  const { t } = useTranslation("workspace");
  return (
    <div className="space-y-3" aria-label={t("accessibility.loadingSchedule")}>
      {["one", "two", "three"].map((id) => (
        <div key={id} className="flex gap-4 rounded-xl border bg-card p-4">
          <Skeleton className="h-12 w-16 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScheduleEmptyState() {
  const { t } = useTranslation("workspace");
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <CalendarX2 className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <h3 className="font-semibold">{t("schedule.emptyTitle")}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("schedule.emptyDescription")}</p>
      </CardContent>
    </Card>
  );
}

export function ScheduleErrorState() {
  const { t } = useTranslation(["workspace", "common"]);
  return (
    <Card className="border-destructive/25 shadow-none">
      <CardContent className="flex flex-col items-center px-6 py-10 text-center">
        <AlertCircle className="mb-3 size-6 text-destructive" aria-hidden="true" />
        <h3 className="font-semibold">{t("schedule.errorTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("schedule.errorDescription")}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          <RefreshCw aria-hidden="true" />
          {t("common:actions.tryAgain")}
        </Button>
      </CardContent>
    </Card>
  );
}

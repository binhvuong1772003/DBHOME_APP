import { Repeat2, UserCheck, UserRound, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import type { CustomerSummary as CustomerSummaryData } from "../types/customer";

export function CustomerSummary({ summary, isLoading }: { summary: CustomerSummaryData; isLoading: boolean }) {
  const { t } = useTranslation("customers");
  const metrics = [
    { key: "total", value: summary.totalCustomers, icon: Users },
    { key: "returning", value: summary.returningCustomers, icon: Repeat2 },
    { key: "new", value: summary.newCustomers, icon: UserCheck },
    { key: "neverVisited", value: summary.neverVisited, icon: UserRound },
  ] as const;
  return (
    <section aria-label={t("summary.title")} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map(({ key, value, icon: Icon }) => (
        <Card key={key} className="gap-0 py-0 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">{t(`summary.${key}`)}</p>
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            {isLoading ? <div className="mt-3 h-7 w-16 animate-pulse rounded bg-muted" /> : <p className="mt-2 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p>}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

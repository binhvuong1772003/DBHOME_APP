import { CircleHelp, Layers3, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FinancialPeriodData } from "../types/financialReport";
import { formatCurrency } from "../utils/formatCurrency";

const revenueLabels: Record<string, string> = {
  SERVICES: "Services",
  PACKAGES: "Packages",
  ADD_ONS: "Add-ons",
};

export function FinancialBreakdowns({ current }: { current: FinancialPeriodData }) {
  const maxRevenue = Math.max(...current.revenueBreakdown.map((item) => item.revenue), 1);
  const payroll = current.payroll;

  return (
    <section className="grid gap-6 xl:grid-cols-2" aria-label="Revenue and cost breakdowns">
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg tracking-tight">Revenue breakdown</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Recorded paid revenue by booking category.</p>
          </div>
          <Layers3 className="size-5 text-primary" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          {current.revenueBreakdown.length === 0 ? (
            <EmptyBreakdown text="No revenue breakdown is available for this period." />
          ) : (
            <div className="space-y-5">
              {current.revenueBreakdown.map((item) => (
                <div key={item.key}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-foreground">{revenueLabels[item.key] ?? item.key}</span>
                    <span className="font-semibold tabular-nums text-foreground">{formatCurrency(item.revenue)}</span>
                  </div>
                  <Progress value={(item.revenue / maxRevenue) * 100} aria-label={`${revenueLabels[item.key] ?? item.key} revenue`} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg tracking-tight">Cost breakdown</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Only tracked operating costs are included.</p>
          </div>
          <WalletCards className="size-5 text-secondary" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          {payroll ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-foreground">Payroll</span>
                <span className="font-semibold tabular-nums text-foreground">{formatCurrency(payroll.cost)}</span>
              </div>
              <Progress value={100} aria-label="Payroll cost" />
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <CircleHelp className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>Rent, supplies, utilities and other operating expenses are not tracked in the current system.</span>
              </div>
            </div>
          ) : (
            <EmptyBreakdown text="Payroll data is not available for this period." />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function EmptyBreakdown({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{text}</div>;
}

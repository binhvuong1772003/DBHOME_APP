import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinancialPeriodData, FinancialReportResponse } from "../types/financialReport";
import { formatCurrency, formatPercentage, percentageChange } from "../utils/formatCurrency";

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function ComparisonRow({
  label,
  current,
  previous,
}: {
  label: string;
  current: number | null;
  previous: number | null;
}) {
  const change = percentageChange(current, previous);
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium tabular-nums text-foreground">{formatCurrency(current)}</span>
      {change !== null ? (
        <Badge className={change >= 0 ? "border-secondary/20 bg-secondary/10 text-secondary" : "border-destructive/20 bg-destructive/10 text-destructive"}>
          {formatPercentage(change)}
        </Badge>
      ) : (
        <span className="text-right text-xs text-muted-foreground">No baseline</span>
      )}
    </div>
  );
}

export function RevenueOverview({
  current,
  previous,
}: {
  current: FinancialPeriodData;
  previous: FinancialReportResponse["previous"];
}) {
  const chartData = current.trend.map((item) => ({
    ...item,
    label: formatChartDate(item.date),
  }));

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.8fr)]" aria-label="Revenue trend and comparison">
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg tracking-tight">Revenue overview</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Paid revenue from completed appointments over time.</p>
          </div>
          <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            Revenue trend
          </span>
        </CardHeader>
        <CardContent>
          {chartData.length < 2 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
              Not enough revenue data to show a trend.
            </div>
          ) : (
            <>
              <div className="h-64 w-full" role="img" aria-label="Revenue trend chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ stroke: "var(--primary)", strokeOpacity: 0.25 }}
                      contentStyle={{
                        borderRadius: "var(--radius)",
                        borderColor: "var(--border)",
                        backgroundColor: "var(--popover)",
                        color: "var(--popover-foreground)",
                      }}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
                      formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="var(--primary)"
                      fillOpacity={0.08}
                      activeDot={{ r: 4, fill: "var(--primary)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <table className="sr-only">
                <caption>Revenue by day</caption>
                <thead><tr><th scope="col">Date</th><th scope="col">Revenue</th></tr></thead>
                <tbody>{chartData.map((item) => <tr key={item.date}><td>{item.date}</td><td>{formatCurrency(item.revenue)}</td></tr>)}</tbody>
              </table>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Period comparison</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Current period compared with the previous period.</p>
        </CardHeader>
        <CardContent className="divide-y divide-border/70">
          <ComparisonRow label="Revenue" current={current.revenue} previous={previous.revenue} />
          <ComparisonRow label="Payroll cost" current={current.payroll?.cost ?? null} previous={previous.payrollCost} />
          <ComparisonRow label="Revenue after payroll" current={current.revenueAfterPayroll} previous={previous.revenueAfterPayroll} />
        </CardContent>
      </Card>
    </section>
  );
}

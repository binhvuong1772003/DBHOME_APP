import { CreditCard, Scissors, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinancialPeriodData } from "../types/financialReport";
import { formatCurrency } from "../utils/formatCurrency";

const paymentMethodLabels: Record<string, string> = {
  CASH: "Cash",
  CARD: "Card",
  TRANSFER: "Transfer",
  MOMO: "MoMo",
  VNPAY: "VNPay",
  ZALO_PAY: "ZaloPay",
};

export function PerformanceSummary({ current }: { current: FinancialPeriodData }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_1.2fr_.8fr]" aria-label="Business performance summaries">
      <PerformanceCard title="Top services" description="Services ranked by recorded revenue." icon={<Scissors className="size-5 text-primary" aria-hidden="true" />}>
        {current.topServices.length === 0 ? (
          <EmptyPerformance text="No service revenue is available for this period." />
        ) : (
          <div className="space-y-3">
            <div className="hidden overflow-x-auto rounded-lg border border-border/70 md:block">
              <table className="w-full min-w-[480px] text-left text-sm">
                <caption className="sr-only">Top services by revenue</caption>
                <thead className="border-b bg-muted/35 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Service</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Appointments</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Revenue</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Avg. ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {current.topServices.map((service) => (
                    <tr key={service.name} className="hover:bg-muted/25">
                      <th scope="row" className="px-4 py-3 font-medium text-foreground">{service.name}</th>
                      <td className="px-4 py-3 text-right tabular-nums">{service.appointments}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(service.revenue)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(service.averageTicket)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 md:hidden">
              {current.topServices.map((service) => (
                <div key={service.name} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-medium text-foreground">{service.name}</p>
                    <p className="shrink-0 text-sm font-semibold tabular-nums">{formatCurrency(service.revenue)}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{service.appointments} appointments · Avg. ticket {formatCurrency(service.averageTicket)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </PerformanceCard>

      <PerformanceCard title="Staff performance" description="Completed appointment revenue by staff." icon={<UsersRound className="size-5 text-secondary" aria-hidden="true" />}>
        {current.staffPerformance.length === 0 ? (
          <EmptyPerformance text="No assigned staff revenue is available for this period." />
        ) : (
          <div className="space-y-3">
            <div className="hidden overflow-x-auto rounded-lg border border-border/70 md:block">
              <table className="w-full min-w-[430px] text-left text-sm">
                <caption className="sr-only">Staff performance by revenue</caption>
                <thead className="border-b bg-muted/35 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Staff</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Completed</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Revenue</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {current.staffPerformance.map((staff) => (
                    <tr key={staff.staffId} className="hover:bg-muted/25">
                      <th scope="row" className="max-w-32 truncate px-4 py-3 font-medium text-foreground">{staff.name}</th>
                      <td className="px-4 py-3 text-right tabular-nums">{staff.appointments}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(staff.revenue)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(staff.commission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 md:hidden">
              {current.staffPerformance.map((staff) => (
                <div key={staff.staffId} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{staff.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{staff.appointments} completed · Commission {formatCurrency(staff.commission)}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums">{formatCurrency(staff.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </PerformanceCard>

      <PerformanceCard title="Payment methods" description="Paid revenue by method." icon={<CreditCard className="size-5 text-primary" aria-hidden="true" />}>
        {current.paymentMethods.length === 0 ? (
          <EmptyPerformance text="Payment method data is not available." />
        ) : (
          <div className="space-y-4">
            {current.paymentMethods.map((item) => {
              const percentage = current.revenue > 0 ? (item.revenue / current.revenue) * 100 : 0;
              return (
                <div key={item.method}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground">{paymentMethodLabels[item.method] ?? item.method}</span>
                    <span className="text-right font-semibold tabular-nums">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                    <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PerformanceCard>
    </section>
  );
}

function PerformanceCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function EmptyPerformance({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{text}</div>;
}

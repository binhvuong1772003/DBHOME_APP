import { CalendarClock, CalendarDays, UserCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StaffStats as StaffStatsValue } from "../types/staff";

interface StaffStatsProps {
  stats: StaffStatsValue;
}

export function StaffStats({ stats }: StaffStatsProps) {
  const activePercentage = stats.total
    ? Math.round((stats.active / stats.total) * 100)
    : 0;

  return (
    <section aria-labelledby="staff-overview-heading">
      <h2 id="staff-overview-heading" className="sr-only">
        Staff overview
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Staff
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {stats.total}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
              <span className="size-1.5 rounded-full bg-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  +{stats.joinedThisMonth}
                </span>{" "}
                this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Staff
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {stats.active}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <UserCheck className="size-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {activePercentage}%
                </span>{" "}
                of total staff
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Working Today
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {stats.workingToday}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary-foreground">
                <CalendarClock className="size-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
              <span className="size-1.5 rounded-full bg-secondary" />
              <p className="text-xs text-muted-foreground">
                Across{" "}
                <span className="font-semibold text-foreground">
                  {stats.shiftCount} shifts
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 overflow-hidden py-0 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  On Leave
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {stats.onLeave}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <CalendarDays className="size-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {stats.returningTomorrow}
                </span>{" "}
                returning tomorrow
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

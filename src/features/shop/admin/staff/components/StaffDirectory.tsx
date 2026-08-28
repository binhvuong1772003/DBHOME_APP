import { ChevronLeft, ChevronRight, Plus, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Staff, StaffViewMode } from "../types/staff";
import { StaffCard } from "./StaffCard";
import { StaffTableRow } from "./StaffTableRow";

interface StaffDirectoryProps {
  staffs: Staff[];
  totalStaffs: number;
  filteredCount: number;
  isLoading: boolean;
  error: string | null;
  viewMode: StaffViewMode;
  canAdd: boolean;
  canEdit: boolean;
  canDeactivate: boolean;
  page: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
  onAddStaff: () => void;
  onRetry: () => void;
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDeactivate: (staff: Staff) => void;
}

function StaffLoadingState() {
  return (
    <section aria-labelledby="loading-staff-heading" aria-busy="true">
      <h2 id="loading-staff-heading" className="sr-only">
        Loading staff
      </h2>
      <Card className="gap-0 overflow-hidden py-0 shadow-xs">
        <CardContent className="space-y-0 p-0">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr_.7fr_.7fr] gap-4 border-b border-border bg-muted/35 px-5 py-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-14" />
          </div>
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="grid grid-cols-[2fr_1fr_1fr_1.2fr_.7fr_.7fr] items-center gap-4 border-b border-border/70 px-5 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

function StaffEmptyState({
  canAdd,
  onAddStaff,
}: {
  canAdd: boolean;
  onAddStaff: () => void;
}) {
  return (
    <section aria-labelledby="empty-staff-heading">
      <Card className="gap-0 py-0 shadow-xs">
        <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRoundPlus className="size-7" aria-hidden="true" />
          </div>
          <h2 id="empty-staff-heading" className="mt-5 text-lg font-semibold">
            No staff members yet
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Add your first team member to start managing your salon staff.
          </p>
          {canAdd && (
            <Button
              type="button"
              className="mt-6 rounded-lg"
              onClick={onAddStaff}
            >
              <Plus aria-hidden="true" />
              Add Staff
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export function StaffDirectory({
  staffs,
  totalStaffs,
  filteredCount,
  isLoading,
  error,
  viewMode,
  canAdd,
  canEdit,
  canDeactivate,
  page,
  totalPages,
  rangeStart,
  rangeEnd,
  onPageChange,
  onAddStaff,
  onRetry,
  onView,
  onEdit,
  onDeactivate,
}: StaffDirectoryProps) {
  if (isLoading) return <StaffLoadingState />;

  if (error) {
    return (
      <Card className="gap-0 py-0 shadow-xs">
        <CardContent className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-sm font-semibold">Unable to load staff</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{error}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 rounded-lg"
            onClick={onRetry}
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (filteredCount === 0) {
    return <StaffEmptyState canAdd={canAdd} onAddStaff={onAddStaff} />;
  }

  return (
    <>
      <section aria-labelledby="staff-directory-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              id="staff-directory-heading"
              className="text-lg font-semibold tracking-tight"
            >
              Team directory
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalStaffs} staff members · Updated just now
            </p>
          </div>
          <span className="hidden rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
            Showing {rangeStart}–{rangeEnd} of {filteredCount}
          </span>
        </div>

        <Card
          className={cn(
            "hidden gap-0 overflow-hidden py-0 shadow-xs",
            viewMode === "LIST" && "lg:block",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <caption className="sr-only">
                Staff directory with roles, status, schedules, appointments,
                revenue, ratings, and actions
              </caption>
              <thead className="border-b border-border bg-muted/35">
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3.5 text-xs font-semibold text-muted-foreground"
                  >
                    Staff
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-xs font-semibold text-muted-foreground"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-xs font-semibold text-muted-foreground"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-xs font-semibold text-muted-foreground"
                  >
                    Today&apos;s Schedule
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-center text-xs font-semibold text-muted-foreground"
                  >
                    Appointments
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground"
                  >
                    Revenue
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-center text-xs font-semibold text-muted-foreground"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="w-16 px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {staffs.map((staff) => (
                  <StaffTableRow
                    key={staff.id}
                    staff={staff}
                    canEdit={canEdit}
                    canDeactivate={canDeactivate}
                    onView={onView}
                    onEdit={onEdit}
                    onDeactivate={onDeactivate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div
          className={cn(
            "grid gap-4 sm:grid-cols-2",
            viewMode === "LIST" ? "lg:hidden" : "xl:grid-cols-3",
          )}
        >
          {staffs.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              canEdit={canEdit}
              canDeactivate={canDeactivate}
              onView={onView}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
            />
          ))}
        </div>
      </section>

      <nav
        aria-label="Staff pagination"
        className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page === 1}
            aria-label="Previous page"
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Button
                key={pageNumber}
                type="button"
                variant={pageNumber === page ? "default" : "ghost"}
                size="sm"
                aria-current={pageNumber === page ? "page" : undefined}
                className="min-w-8"
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            ),
          )}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page === totalPages}
            aria-label="Next page"
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </nav>
    </>
  );
}

import { ArrowDownAZ, Grid2X2, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STAFF_ROLE_FILTER_OPTIONS,
  STAFF_SORT_OPTIONS,
  STAFF_STATUS_FILTER_OPTIONS,
} from "../constants/staff";
import type {
  StaffRoleFilter,
  StaffSort,
  StaffStatusFilter,
  StaffViewMode,
} from "../types/staff";

interface StaffToolbarProps {
  search: string;
  role: StaffRoleFilter;
  status: StaffStatusFilter;
  sort: StaffSort;
  viewMode: StaffViewMode;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: StaffRoleFilter) => void;
  onStatusChange: (value: StaffStatusFilter) => void;
  onSortChange: (value: StaffSort) => void;
  onViewModeChange: (value: StaffViewMode) => void;
}

export function StaffToolbar({
  search,
  role,
  status,
  sort,
  viewMode,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onSortChange,
  onViewModeChange,
}: StaffToolbarProps) {
  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:max-w-[980px]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                aria-label="Search staff"
                placeholder="Search staff by name or email..."
                className="h-10 rounded-lg bg-background pl-9"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>

            <Select value={status} onValueChange={(value) => onStatusChange(value as StaffStatusFilter)}>
              <SelectTrigger className="h-10 w-full rounded-lg bg-background" aria-label="Filter by staff status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={role} onValueChange={(value) => onRoleChange(value as StaffRoleFilter)}>
              <SelectTrigger className="h-10 w-full rounded-lg bg-background" aria-label="Filter by staff role">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLE_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(value) => onSortChange(value as StaffSort)}>
              <SelectTrigger className="h-10 w-full rounded-lg bg-background" aria-label="Sort staff">
                <ArrowDownAZ className="size-4" aria-hidden="true" />
                <SelectValue placeholder="Recently Added" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center self-end rounded-lg border border-border bg-background p-1 xl:self-auto">
            <Button
              type="button"
              variant={viewMode === "LIST" ? "default" : "ghost"}
              size="sm"
              aria-label="List view"
              aria-pressed={viewMode === "LIST"}
              className={
                viewMode === "LIST"
                  ? "h-8 rounded-md px-3"
                  : "h-8 rounded-md px-3 text-muted-foreground"
              }
              onClick={() => onViewModeChange("LIST")}
            >
              <List aria-hidden="true" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button
              type="button"
              variant={viewMode === "GRID" ? "default" : "ghost"}
              size="sm"
              aria-label="Grid view"
              aria-pressed={viewMode === "GRID"}
              className={
                viewMode === "GRID"
                  ? "h-8 rounded-md px-3"
                  : "h-8 rounded-md px-3 text-muted-foreground"
              }
              onClick={() => onViewModeChange("GRID")}
            >
              <Grid2X2 aria-hidden="true" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

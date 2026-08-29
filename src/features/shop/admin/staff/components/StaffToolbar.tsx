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
import { useTranslation } from "react-i18next";

const optionKey = (value: string) =>
  ({
    ALL: "all",
    OWNER: "owner",
    MANAGER: "manager",
    STAFF: "staff",
    ACTIVE: "active",
    INACTIVE: "inactive",
    ON_LEAVE: "onLeave",
    RECENT: "recent",
    NAME_ASC: "nameAsc",
    NAME_DESC: "nameDesc",
    REVENUE: "revenue",
  })[value] ?? value;

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
  const { t } = useTranslation("staff");
  return (
    <Card className="gap-0 py-0 shadow-xs">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:max-w-[980px]">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                aria-label={t("toolbar.searchLabel")}
                placeholder={t("toolbar.searchPlaceholder")}
                className="h-10 rounded-lg bg-background pl-9"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>

            <Select value={status} onValueChange={(value) => onStatusChange(value as StaffStatusFilter)}>
              <SelectTrigger className="h-10 w-full rounded-lg bg-background" aria-label={t("toolbar.statusLabel")}>
                <SelectValue placeholder={t("status.all")} />
              </SelectTrigger>
              <SelectContent>
                {STAFF_STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`status.${optionKey(option.value)}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={role} onValueChange={(value) => onRoleChange(value as StaffRoleFilter)}>
              <SelectTrigger className="h-10 w-full rounded-lg bg-background" aria-label={t("toolbar.roleLabel")}>
                <SelectValue placeholder={t("roles.all")} />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLE_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`roles.${optionKey(option.value)}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(value) => onSortChange(value as StaffSort)}>
              <SelectTrigger className="h-10 w-full rounded-lg bg-background" aria-label={t("toolbar.sortLabel")}>
                <ArrowDownAZ className="size-4" aria-hidden="true" />
                <SelectValue placeholder={t("sort.recent")} />
              </SelectTrigger>
              <SelectContent>
                {STAFF_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`sort.${optionKey(option.value)}`)}
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
              aria-label={t("toolbar.listView")}
              aria-pressed={viewMode === "LIST"}
              className={
                viewMode === "LIST"
                  ? "h-8 rounded-md px-3"
                  : "h-8 rounded-md px-3 text-muted-foreground"
              }
              onClick={() => onViewModeChange("LIST")}
            >
              <List aria-hidden="true" />
              <span className="hidden sm:inline">{t("toolbar.list")}</span>
            </Button>
            <Button
              type="button"
              variant={viewMode === "GRID" ? "default" : "ghost"}
              size="sm"
              aria-label={t("toolbar.gridView")}
              aria-pressed={viewMode === "GRID"}
              className={
                viewMode === "GRID"
                  ? "h-8 rounded-md px-3"
                  : "h-8 rounded-md px-3 text-muted-foreground"
              }
              onClick={() => onViewModeChange("GRID")}
            >
              <Grid2X2 aria-hidden="true" />
              <span className="hidden sm:inline">{t("toolbar.grid")}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

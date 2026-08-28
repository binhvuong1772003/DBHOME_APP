import { Card, CardContent } from "../ui/card";
import { CiExport, CiSearch } from "react-icons/ci";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useServiceManagement } from "@/hooks/useServiceManagement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ImageOff,
  Clock,
  Plus,
} from "lucide-react";

export const ManageServiceForm = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    sortedServiceList,
    activeTab,
    setActiveTab,
    handleSort,
    handleStatusChange,
    sortColumn,
    sortOrder,
    counts,
    expandedServiceIds,
    setExpandedServiceIds,
    tabs,
  } = useServiceManagement();

  const formatVnd = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(value) + "đ";

  // Single grid definition drives header, rows, and nested option rows —
  // one place to change alignment instead of five.
  const grid =
    "grid grid-cols-[24px_minmax(0,1fr)_100px_160px_120px_100px] items-center gap-4";

  const SortHead = ({
    column,
    align = "left",
    children,
  }: {
    column: string;
    align?: "left" | "right";
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={() => handleSort(column)}
      className={`group flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      {children}
      {sortColumn === column ? (
        sortOrder === "asc" ? (
          <ArrowUp className="size-3" />
        ) : (
          <ArrowDown className="size-3" />
        )
      ) : (
        <ArrowUp className="size-3 opacity-0 transition-opacity group-hover:opacity-30" />
      )}
    </button>
  );

  return (
    <div className="bg-muted/20 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card px-6 py-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            {counts.all} service{counts.all === 1 ? "" : "s"} · {counts.active}{" "}
            active
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CiExport className="mr-1.5 size-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => navigate("create")}>
            <Plus className="mr-1 size-4" />
            Add service
          </Button>
        </div>
      </div>

      <div className="space-y-4 px-6 py-5">
        {/* Tabs + search */}
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-lg border bg-card p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/20"
                      : "bg-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products" className="bg-card pl-9" />
          </div>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-sm text-muted-foreground">
            Loading services…
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
            <p className="text-sm font-medium text-destructive">
              Couldn't load services
            </p>
            <p className="text-sm text-muted-foreground">
              Try refreshing the page.
            </p>
          </div>
        )}

        {!isLoading && !error && sortedServiceList?.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {activeTab === "all"
                ? "You haven't added any services yet."
                : `No ${activeTab} services.`}
            </p>
            <Button size="sm" onClick={() => navigate("create")}>
              <Plus className="mr-1 size-4" />
              Add your first service
            </Button>
          </div>
        )}

        {/* Table */}
        {!isLoading &&
          !error &&
          sortedServiceList &&
          sortedServiceList.length > 0 && (
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className={`${grid} border-b bg-muted/40 px-4 py-2.5`}>
                <Checkbox />
                <SortHead column="product">Service</SortHead>
                <SortHead column="status">Status</SortHead>
                <SortHead column="category">Category</SortHead>
                <SortHead column="price" align="right">
                  Price
                </SortHead>
                <SortHead column="duration" align="right">
                  Duration
                </SortHead>
              </div>

              <div className="divide-y">
                {sortedServiceList.map((service) => {
                  const isExpanded = expandedServiceIds.includes(service.id);
                  const optionCount = service.options?.length ?? 0;

                  return (
                    <div key={service.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedServiceIds(
                            isExpanded
                              ? expandedServiceIds.filter(
                                  (id) => id !== service.id,
                                )
                              : [...expandedServiceIds, service.id],
                          )
                        }
                        className={`${grid} w-full px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`}
                      >
                        <Checkbox onClick={(e) => e.stopPropagation()} />

                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                            {service.imageUrl ? (
                              <img
                                src={service.imageUrl}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              <ImageOff className="size-4" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <ChevronDown
                                className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                              <span className="truncate font-medium">
                                {service.name}
                              </span>
                            </span>
                            {optionCount > 0 && (
                              <span className="ml-5 block text-xs text-muted-foreground">
                                {optionCount} option group
                                {optionCount === 1 ? "" : "s"}
                              </span>
                            )}
                          </span>
                        </span>

                        <span onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                  service.isActive
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    service.isActive
                                      ? "bg-emerald-600"
                                      : "bg-muted-foreground"
                                  }`}
                                />
                                {service.isActive ? "Active" : "Inactive"}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(service.id, true)
                                }
                                disabled={isLoading}
                              >
                                Active
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(service.id, false)
                                }
                                disabled={isLoading}
                              >
                                Inactive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </span>

                        <span className="truncate text-sm text-muted-foreground">
                          {service.categoryId ?? "—"}
                        </span>

                        <span className="text-right text-sm font-medium tabular-nums">
                          {formatVnd(service.basePrice ?? 0)}
                        </span>

                        <span className="flex items-center justify-end gap-1 text-right text-sm text-muted-foreground tabular-nums">
                          <Clock className="size-3.5" />
                          {service.durationMin ?? 0}p
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="space-y-4 border-t bg-muted/20 px-4 py-4">
                          {service.options?.map((option) => (
                            <div
                              key={option.id}
                              className="rounded-lg border bg-card"
                            >
                              <div className="flex items-center justify-between border-b px-3 py-2">
                                <span className="text-sm font-semibold">
                                  {option.name}
                                </span>
                                {option.isRequired && (
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    Required
                                  </span>
                                )}
                              </div>
                              <div className="divide-y">
                                {option.values?.map((value) => (
                                  <div
                                    key={value.id}
                                    className="flex items-center justify-between px-3 py-2 text-sm"
                                  >
                                    <span>{value.name}</span>
                                    <span className="flex items-center gap-3 tabular-nums text-muted-foreground">
                                      <span
                                        className={
                                          value.price > 0
                                            ? "text-emerald-600"
                                            : ""
                                        }
                                      >
                                        {value.price > 0
                                          ? `+${formatVnd(value.price)}`
                                          : formatVnd(value.price)}
                                      </span>
                                      <span>+{value.duration}p</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

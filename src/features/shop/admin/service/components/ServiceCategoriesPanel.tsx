import type { LucideIcon } from "lucide-react";
import {
  Flower2,
  Footprints,
  Hand,
  ChevronLeft,
  ChevronRight,
  Layers3,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useServiceCategories } from "../hooks/useServiceCategories";
import type { ServiceCategory } from "@/types/service";

interface ServiceCategoriesPanelProps {
  categories: ServiceCategory[];
  total: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  hand: Hand,
  footprints: Footprints,
  sparkles: Sparkles,
  "flower-2": Flower2,
};

function CategoryIcon({ icon }: { icon?: string | null }) {
  const Icon = (icon && categoryIcons[icon]) || Layers3;
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

function CategoryCard({ category, activeLabel, hiddenLabel, serviceCountLabel }: { category: ServiceCategory; activeLabel: string; hiddenLabel: string; serviceCountLabel: string }) {
  const isActive = category.isActive !== false;
  return (
    <Card className="group overflow-hidden rounded-xl border-border/60 bg-card shadow-xs transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <CategoryIcon icon={category.icon} />
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${isActive ? "border-success/30 bg-success/10 text-success" : "border-border bg-muted text-muted-foreground"}`}>
            <span className={`size-1.5 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`} aria-hidden="true" />
            {isActive ? activeLabel : hiddenLabel}
          </span>
        </div>
        <h3 className="mt-4 truncate font-semibold" title={category.name}>{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{serviceCountLabel}</p>
      </CardContent>
    </Card>
  );
}

export function ServiceCategoriesPanel({
  categories,
  total,
  isLoading,
  error,
  onRetry,
}: ServiceCategoriesPanelProps) {
  const { t } = useTranslation("service");
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const {
    categories: allCategoryItems,
    isLoading: allCategoriesLoading,
    error: allCategoriesError,
    meta: allCategoriesMeta,
    page: allCategoriesPage,
    totalPages: allCategoriesTotalPages,
    setPage: setAllCategoriesPage,
    refetch: refetchAllCategories,
  } = useServiceCategories({ load: false, limit: 8 });
  const hasMoreCategories = total > categories.length;

  useEffect(() => {
    if (viewAllOpen) void refetchAllCategories();
  }, [refetchAllCategories, viewAllOpen]);

  return (
    <section className="space-y-4" aria-labelledby="service-categories-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {t("category.eyebrow")}
          </p>
          <h2 id="service-categories-heading" className="mt-1 text-lg font-semibold tracking-tight">
            {t("category.viewTitle")}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("category.viewDescription")}
          </p>
        </div>
        {!isLoading && !error && categories.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {t("category.total", { count: total })}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label={t("category.loading")}>
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-xl border border-border/60 bg-muted" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-destructive">{error}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("category.refreshHint")}</p>
          </div>
          <Button type="button" variant="outline" className="min-h-11 shrink-0" onClick={onRetry}>
            <RefreshCcw className="size-4" aria-hidden="true" />
            {t("category.retry")}
          </Button>
        </div>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/80 bg-card px-6 py-10 text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Layers3 className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-3 font-medium">{t("category.empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("category.viewEmptyDescription")}</p>
        </div>
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} activeLabel={t("status.active")} hiddenLabel={t("status.hidden")} serviceCountLabel={t("category.serviceCount", { count: category.serviceCount ?? 0 })} />
            ))}
          </div>
          {hasMoreCategories && (
            <div className="flex flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{t("category.moreCount", { count: total - categories.length })}</p>
              <Button type="button" variant="outline" className="min-h-11 w-full sm:w-auto" onClick={() => setViewAllOpen(true)}>
                {t("category.viewAll")}
              </Button>
            </div>
          )}
        </div>
      )}

      <Sheet open={viewAllOpen} onOpenChange={setViewAllOpen}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl">
          <SheetHeader className="border-b px-5 py-5 pr-12 text-left sm:px-6">
            <SheetTitle>{t("category.viewTitle")}</SheetTitle>
            <SheetDescription>{t("category.viewDescription")}</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            {allCategoriesLoading && (
              <div className="grid gap-3 sm:grid-cols-2" aria-busy="true" aria-label={t("category.loading")}>
                {[0, 1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl border border-border/60 bg-muted" />)}
              </div>
            )}
            {!allCategoriesLoading && allCategoriesError && (
              <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
                <p className="font-medium text-destructive">{allCategoriesError}</p>
                <Button type="button" variant="outline" className="mt-3 min-h-11" onClick={() => void refetchAllCategories()}>
                  <RefreshCcw className="size-4" aria-hidden="true" />
                  {t("category.retry")}
                </Button>
              </div>
            )}
            {!allCategoriesLoading && !allCategoriesError && allCategoryItems.length > 0 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {allCategoryItems.map((category) => (
                    <CategoryCard key={category.id} category={category} activeLabel={t("status.active")} hiddenLabel={t("status.hidden")} serviceCountLabel={t("category.serviceCount", { count: category.serviceCount ?? 0 })} />
                  ))}
                </div>
                {allCategoriesTotalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground">
                    <span>{t("pagination.page", { current: allCategoriesPage, total: allCategoriesTotalPages })}</span>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" className="size-11" disabled={!allCategoriesMeta.hasPrev || allCategoriesLoading} onClick={() => setAllCategoriesPage(allCategoriesPage - 1)} aria-label={t("pagination.previous")}>
                        <ChevronLeft className="size-4" aria-hidden="true" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" className="size-11" disabled={!allCategoriesMeta.hasNext || allCategoriesLoading} onClick={() => setAllCategoriesPage(allCategoriesPage + 1)} aria-label={t("pagination.next")}>
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

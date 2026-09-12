import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  Store,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/common/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { PublicMarketplaceShop, PublicMarketplaceMatchedService } from "@/services/marketplaceService";
import type { ShopType } from "@/type/shop";
import {
  SHOP_TYPES,
  useMarketplaceSearch,
} from "../hooks/useMarketplaceSearch";

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function initials(name?: string | null) {
  return (
    (name ?? "SHN")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SHN"
  );
}

function formatPrice(value?: number | null) {
  return typeof value === "number" ? money.format(value) : "—";
}

function ShopTypeLabel({ type, t }: { type?: ShopType; t: (key: string) => string }) {
  return t(`type.${type?.toLowerCase() ?? "combo"}`);
}

function SafeCover({ shop, fallback }: { shop: PublicMarketplaceShop; fallback: string }) {
  const [failed, setFailed] = useState(!shop.coverUrl);
  if (failed || !shop.coverUrl) {
    return (
      <div className="flex size-full min-h-48 flex-col items-center justify-center gap-2 bg-muted text-center text-sm text-muted-foreground">
        <Store className="size-8 text-primary" aria-hidden="true" />
        <span>{fallback}</span>
      </div>
    );
  }
  return (
    <img
      src={shop.coverUrl}
      alt={`${shop.name} cover`}
      width="720"
      height="450"
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  );
}

function ShopCard({
  shop,
  query,
  t,
}: {
  shop: PublicMarketplaceShop;
  query: { search?: string };
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const location = [shop.address, shop.district, shop.city].filter(Boolean).join(", ");
  const services: PublicMarketplaceMatchedService[] = query.search
    ? (shop.matchedServices ?? [])
    : shop.services.slice(0, 1);

  return (
    <Card className="group min-w-0 overflow-hidden border-border/80 bg-card py-0 shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <SafeCover shop={shop} fallback={t("card.coverFallback")} />
      </div>
      <CardContent className="flex min-w-0 flex-col gap-4 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="size-11 shrink-0 border border-border">
            <AvatarImage src={shop.logoUrl ?? undefined} alt={shop.name} />
            <AvatarFallback>{initials(shop.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground" title={shop.name}>
                {shop.name}
              </h2>
              <Badge className="shrink-0 border-primary/25 bg-primary/10 text-[0.68rem] font-medium text-primary">
                <Store className="mr-1 size-3.5" aria-hidden="true" />
                <ShopTypeLabel type={shop.type} t={t} />
              </Badge>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-sm leading-5 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="line-clamp-2">{location || t("card.locationFallback")}</span>
            </p>
          </div>
        </div>

        {services.length > 0 && (
          <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {query.search ? t("card.matchedServices") : t("card.featuredService")}
            </p>
            <div className="mt-2 grid gap-2">
              {services.slice(0, 3).map((service) => (
                <div key={service.id} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium text-foreground" title={service.name}>
                    {service.name}
                  </span>
                  <span className="shrink-0 text-right text-xs text-muted-foreground">
                    {formatPrice(service.basePrice)}
                    <span className="ml-1.5 inline-flex items-center gap-1">
                      <Clock3 className="size-3" aria-hidden="true" />
                      {t("card.duration", { minutes: service.durationMin })}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          to={`/shops/${shop.slug}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/30 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        >
          {t("card.viewShop")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}

function ShopCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/80 py-0">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <CardContent className="space-y-4 p-5">
        <div className="flex gap-3">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

type PageItem = number | "ellipsis";

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const visible = new Set([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) [2, 3, 4, 5].forEach((value) => visible.add(value));
  if (page >= totalPages - 2) {
    [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1].forEach((value) => visible.add(value));
  }

  const numbers = [...visible].filter((value) => value > 0 && value <= totalPages).sort((a, b) => a - b);
  return numbers.flatMap((value, index) => {
    const previous = numbers[index - 1];
    return index > 0 && previous !== undefined && value - previous > 1
      ? ["ellipsis" as const, value]
      : [value];
  });
}

function ShopPagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  loading,
  onPageChange,
  t,
}: {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  if (totalPages < 1) return null;
  const pageItems = getPageItems(page, totalPages);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label={t("results.pagination")}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 shrink-0"
        disabled={!hasPrev || loading}
        onClick={() => onPageChange(page - 1)}
        aria-label={t("results.previous")}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>
      <div className="hidden items-center gap-1 sm:flex">
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="inline-flex size-11 items-center justify-center text-sm text-muted-foreground" aria-hidden="true">
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === page ? "default" : "outline"}
              className="size-11 shrink-0 p-0 tabular-nums"
              disabled={loading}
              onClick={() => onPageChange(item)}
              aria-label={t("results.goToPage", { page: item })}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Button>
          ),
        )}
      </div>
      <span className="min-w-28 text-center text-sm tabular-nums text-muted-foreground sm:hidden">
        {t("results.page", { page, totalPages })}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 shrink-0"
        disabled={!hasNext || loading}
        onClick={() => onPageChange(page + 1)}
        aria-label={t("results.next")}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}

export default function SalonsPage() {
  const { t } = useTranslation("marketplaceSearch");
  const search = useMarketplaceSearch(t("states.loadError"));
  const {
    query,
    draftSearch,
    draftCity,
    setDraftSearch,
    setDraftCity,
    items,
    meta,
    loading,
    error,
    submitSearch,
    clearFilters,
    retry,
    updateQuery,
    hasFilters,
  } = search;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  const activeFilters = [
    query.search ? { key: "search", label: t("filters.searchValue", { value: query.search }) } : null,
    query.city ? { key: "city", label: t("filters.cityValue", { value: query.city }) } : null,
    query.type ? { key: "type", label: t(`type.${query.type.toLowerCase()}`) } : null,
  ].filter(Boolean) as { key: "search" | "city" | "type"; label: string }[];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-[calc(100%_-_2rem)] max-w-7xl py-8 sm:w-[calc(100%_-_3rem)] sm:py-12">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{t("eyebrow")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{t("description")}</p>
        </header>

        <section className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5" aria-label={t("search.ariaLabel")}>
          <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto]" role="search">
            <label className="min-w-0">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("search.nameLabel")}</span>
              <span className="flex min-h-11 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <Search className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <Input
                  value={draftSearch}
                  onChange={(event) => setDraftSearch(event.target.value)}
                  placeholder={t("search.namePlaceholder")}
                  className="h-10 min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </span>
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("search.cityLabel")}</span>
              <span className="flex min-h-11 items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <Input
                  value={draftCity}
                  onChange={(event) => setDraftCity(event.target.value)}
                  placeholder={t("search.cityPlaceholder")}
                  className="h-10 min-w-0 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </span>
            </label>
            <Button type="submit" className="min-h-11 gap-2 lg:mt-6">
              <Search className="size-4" aria-hidden="true" />
              {t("search.submit")}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("filters.typeLabel")}>
              <span className="mr-1 text-xs font-medium text-muted-foreground">{t("filters.typeLabel")}</span>
              <Button
                type="button"
                size="sm"
                variant={!query.type ? "default" : "outline"}
                className="min-h-10 rounded-full"
                onClick={() => updateQuery({ type: undefined, page: 1 })}
                aria-pressed={!query.type}
              >
                {t("filters.all")}
              </Button>
              {SHOP_TYPES.map((type) => (
                <Button
                  key={type}
                  type="button"
                  size="sm"
                  variant={query.type === type ? "default" : "outline"}
                  className="min-h-10 rounded-full"
                  onClick={() => updateQuery({ type, page: 1 })}
                  aria-pressed={query.type === type}
                >
                  {t(`type.${type.toLowerCase()}`)}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8" aria-live="polite" aria-busy={loading}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {loading ? t("results.loading") : t("results.count", { count: meta?.total ?? 0 })}
              </p>
              {activeFilters.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t("filters.applied")}</span>
                  {activeFilters.map((filter) => (
                    <Badge key={filter.key} className="gap-1 border-border bg-muted text-xs font-normal text-foreground">
                      <span className="max-w-56 truncate" title={filter.label}>{filter.label}</span>
                      <button
                        type="button"
                        className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full hover:bg-background focus-visible:outline-2 focus-visible:outline-ring"
                        onClick={() => updateQuery({ [filter.key]: undefined, page: 1 })}
                        aria-label={t("filters.remove", { value: filter.label })}
                      >
                        <X className="size-3" aria-hidden="true" />
                      </button>
                    </Badge>
                  ))}
                  <Button type="button" variant="ghost" size="sm" className="min-h-9 px-2 text-xs" onClick={clearFilters}>
                    {t("filters.clear")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error ? (
            <div className="mt-6 flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-card p-6 text-center">
              <p className="text-sm text-destructive">{t("states.loadError")}</p>
              <p className="max-w-md text-xs text-muted-foreground">{error}</p>
              <Button type="button" variant="outline" className="min-h-11 gap-2" onClick={retry}>
                <RefreshCw className="size-4" aria-hidden="true" />
                {t("states.retry")}
              </Button>
            </div>
          ) : loading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => <ShopCardSkeleton key={index} />)}
            </div>
          ) : items.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((shop) => <ShopCard key={shop.id} shop={shop} query={query} t={t} />)}
            </div>
          ) : (
            <div className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <Store className="size-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold">{t(hasFilters ? "states.emptyFilteredTitle" : "states.emptyTitle")}</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{t(hasFilters ? "states.emptyFilteredDescription" : "states.emptyDescription")}</p>
              {hasFilters && <Button type="button" variant="outline" className="mt-4 min-h-11" onClick={clearFilters}>{t("filters.clear")}</Button>}
            </div>
          )}

          {!loading && !error && meta && (
            <ShopPagination
              page={meta.page}
              totalPages={meta.totalPages}
              hasPrev={meta.hasPrev}
              hasNext={meta.hasNext}
              loading={loading}
              onPageChange={(nextPage) => updateQuery({ page: nextPage })}
              t={t}
            />
          )}
        </section>
      </main>
    </div>
  );
}

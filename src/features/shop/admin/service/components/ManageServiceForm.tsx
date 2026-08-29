import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Ellipsis,
  ImageOff,
  Layers3,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServiceManagement } from "@/features/shop/admin/service/hooks/useServiceManagement";
import type { Service } from "@/types/service";

type StatusTab = "all" | "active" | "inactive";

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

function ServiceImage({ service }: { service: Service }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted text-muted-foreground">
      {service.imageUrl ? <img src={service.imageUrl} alt="" className="size-full object-cover" /> : <ImageOff className="size-4" aria-hidden="true" />}
    </span>
  );
}

function StatusBadge({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isActive ? "bg-secondary/20 text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
      <span className={`size-1.5 rounded-full ${isActive ? "bg-secondary-foreground" : "bg-muted-foreground"}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function ServiceOptions({ service, requiredLabel, optionGroupLabel, pricePrefix }: { service: Service; requiredLabel: string; optionGroupLabel: string; pricePrefix: string }) {
  if (!service.options?.length) return null;
  return (
    <div className="space-y-3 border-t border-border/60 bg-muted/20 px-4 py-4 sm:px-5">
      {service.options.map((option) => (
        <div key={option.id} className="rounded-lg border border-border/60 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 px-3 py-2.5">
            <span className="text-sm font-semibold">{option.name}</span>
            {option.isRequired && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{requiredLabel}</span>}
          </div>
          <div className="divide-y divide-border/60">
            {option.values?.map((value) => (
              <div key={value.id} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
                <span className="min-w-0 truncate">{value.name}</span>
                <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {value.price > 0 ? `${pricePrefix}${formatCurrency(value.price, "vi-VN")}` : formatCurrency(value.price, "vi-VN")}
                  <span className="mx-1.5 text-border">·</span>{value.duration} min
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">{service.options.length} {optionGroupLabel}</p>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon: ReactNode; accent?: string }) {
  return (
    <Card className="gap-3 rounded-xl border-border/60 py-4 shadow-xs">
      <CardContent className="flex items-center justify-between gap-3 px-4">
        <div className="min-w-0"><p className="truncate text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p></div>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted ${accent ?? "text-muted-foreground"}`}>{icon}</span>
      </CardContent>
    </Card>
  );
}

export const ManageServiceForm = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("service");
  const { isLoading, error, sortedServiceList, activeTab, setActiveTab, search, setSearch, handleSort, handleStatusChange, sortColumn, sortOrder, counts, expandedServiceIds, setExpandedServiceIds, totalPages, rangeStart, rangeEnd, page, setPage } = useServiceManagement();
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  const services = sortedServiceList ?? [];
  const hasFilters = search.length > 0 || activeTab !== "all";
  const setTab = (tab: StatusTab) => setActiveTab(tab);
  const resetFilters = () => { setSearch(""); setTab("all"); };
  const toggleExpanded = (serviceId: string) => setExpandedServiceIds((current) => current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId]);
  const statusLabel = (isActive: boolean) => isActive ? t("status.active") : t("status.hidden");
  const categoryCount = counts.categories;

  return (
    <main className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-[1480px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary"><Sparkles className="size-3.5" aria-hidden="true" />{t("page.eyebrow")}</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("page.title")}</h1><p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("page.description")}</p></div>
          <Button className="h-10 rounded-lg px-4" onClick={() => navigate("create")}><Plus className="size-4" aria-hidden="true" />{t("actions.add")}</Button>
        </header>

        <section aria-label={t("overview.label")} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t("overview.all")} value={counts.all} icon={<Layers3 className="size-4" aria-hidden="true" />} />
          <StatCard label={t("overview.active")} value={counts.active} icon={<CheckCircle2 className="size-4" aria-hidden="true" />} accent="text-secondary-foreground" />
          <StatCard label={t("overview.hidden")} value={counts.inactive} icon={<Ellipsis className="size-4" aria-hidden="true" />} />
          <StatCard label={t("overview.categories")} value={categoryCount} icon={<SlidersHorizontal className="size-4" aria-hidden="true" />} />
        </section>

        <section className="space-y-4" aria-label={t("toolbar.label")}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-card p-1">
              {(["all", "active", "inactive"] as const).map((tab) => <button key={tab} type="button" onClick={() => setTab(tab)} className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{t(`filters.${tab}`)}<span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === tab ? "bg-primary-foreground/20" : "bg-muted"}`}>{counts[tab]}</span></button>)}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("search.placeholder")} aria-label={t("search.label")} className="h-10 rounded-lg border-border/60 bg-card pl-9 pr-9" />{search && <button type="button" onClick={() => setSearch("")} aria-label={t("search.clear")} className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-3.5" aria-hidden="true" /></button>}</div>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="h-10 justify-between rounded-lg border-border/60 bg-card sm:w-36"><span className="flex items-center gap-2"><SlidersHorizontal className="size-4" aria-hidden="true" />{t("sort.label")}</span><ChevronDown className="size-4" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleSort("product")}>{t("sort.name")} {sortColumn === "product" && (sortOrder === "asc" ? <ArrowUp className="ml-auto size-3" /> : <ArrowDown className="ml-auto size-3" />)}</DropdownMenuItem><DropdownMenuItem onClick={() => handleSort("price")}>{t("sort.price")}</DropdownMenuItem><DropdownMenuItem onClick={() => handleSort("duration")}>{t("sort.duration")}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
              {hasFilters && <Button variant="ghost" className="h-10 rounded-lg px-3 text-muted-foreground" onClick={resetFilters}>{t("filters.clear")}</Button>}
            </div>
          </div>

          {isLoading && <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4" aria-busy="true">{[1, 2, 3, 4].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-muted" />)}</div>}
          {error && !isLoading && <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center"><p className="font-medium text-destructive">{t("messages.loadError")}</p><p className="mt-1 text-sm text-muted-foreground">{t("messages.refreshHint")}</p></div>}
          {!isLoading && !error && services.length === 0 && <div className="rounded-xl border border-dashed border-border/80 bg-card px-6 py-16 text-center"><div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground"><Layers3 className="size-5" aria-hidden="true" /></div><h2 className="mt-4 font-semibold">{hasFilters ? t("empty.filteredTitle") : t("empty.title")}</h2><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{hasFilters ? t("empty.filteredDescription") : t("empty.description")}</p><Button className="mt-5 rounded-lg" onClick={() => hasFilters ? resetFilters() : navigate("create")}><Plus className="size-4" aria-hidden="true" />{hasFilters ? t("filters.clear") : t("actions.add")}</Button></div>}

          {!isLoading && !error && services.length > 0 && <>
            <div className="hidden overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs md:block">
              <div className="grid grid-cols-[minmax(0,1.7fr)_130px_150px_130px_42px] items-center gap-4 border-b border-border/60 bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><span>{t("fields.service")}</span><span>{t("fields.category")}</span><span>{t("fields.status")}</span><span className="text-right">{t("fields.priceDuration")}</span><span aria-hidden="true" /></div>
              <div className="divide-y divide-border/60">{services.map((service) => { const expanded = expandedServiceIds.includes(service.id); return <div key={service.id}><div className="grid grid-cols-[minmax(0,1.7fr)_130px_150px_130px_42px] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/25"><button type="button" onClick={() => toggleExpanded(service.id)} className="flex min-w-0 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ServiceImage service={service} /><span className="min-w-0"><span className="flex items-center gap-2"><ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" /><span className="truncate font-semibold">{service.name}</span></span><span className="ml-6 block truncate text-xs text-muted-foreground">{service.options?.length ? t("service.optionGroups", { count: service.options.length }) : t("service.noOptions")}</span></span></button><span className="truncate text-sm text-muted-foreground">{service.categoryId ?? t("service.uncategorized")}</span><DropdownMenu><DropdownMenuTrigger asChild><button type="button" aria-label={t("actions.changeStatus")} className="w-fit rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><StatusBadge isActive={service.isActive} label={statusLabel(service.isActive)} /></button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem onClick={() => handleStatusChange(service.id, true)}>{t("status.active")}</DropdownMenuItem><DropdownMenuItem onClick={() => handleStatusChange(service.id, false)}>{t("status.hidden")}</DropdownMenuItem></DropdownMenuContent></DropdownMenu><span className="text-right text-sm tabular-nums"><span className="block font-medium">{formatCurrency(service.basePrice ?? 0, locale)}</span><span className="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" />{service.durationMin ?? 0} {t("units.minutes")}</span></span><button type="button" onClick={() => toggleExpanded(service.id)} aria-label={expanded ? t("actions.collapse") : t("actions.expand")} className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Ellipsis className="size-4" aria-hidden="true" /></button></div>{expanded && <ServiceOptions service={service} requiredLabel={t("service.required")} optionGroupLabel={t("service.optionGroups", { count: service.options?.length ?? 0 })} pricePrefix={t("units.pricePrefix")} />}</div>; })}</div>
            </div>
            <div className="space-y-3 md:hidden">{services.map((service) => { const expanded = expandedServiceIds.includes(service.id); return <Card key={service.id} className="gap-0 overflow-hidden rounded-xl border-border/60 py-0 shadow-xs"><CardContent className="p-4"><div className="flex items-start gap-3"><ServiceImage service={service} /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{service.name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{service.categoryId ?? t("service.uncategorized")}</p></div><DropdownMenu><DropdownMenuTrigger asChild><button type="button" aria-label={t("actions.changeStatus")}><StatusBadge isActive={service.isActive} label={statusLabel(service.isActive)} /></button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => handleStatusChange(service.id, true)}>{t("status.active")}</DropdownMenuItem><DropdownMenuItem onClick={() => handleStatusChange(service.id, false)}>{t("status.hidden")}</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div><div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-sm"><span className="font-medium">{formatCurrency(service.basePrice ?? 0, locale)}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" aria-hidden="true" />{service.durationMin ?? 0} {t("units.minutes")}</span><Button variant="ghost" size="sm" className="h-8 rounded-lg px-2" onClick={() => toggleExpanded(service.id)}>{expanded ? t("actions.hideOptions") : t("actions.viewOptions")}</Button></div></CardContent>{expanded && <ServiceOptions service={service} requiredLabel={t("service.required")} optionGroupLabel={t("service.optionGroups", { count: service.options?.length ?? 0 })} pricePrefix={t("units.pricePrefix")} />}</Card>; })}</div>
            {totalPages > 1 && <div className="flex flex-col gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Hiển thị {rangeStart}-{rangeEnd} trong {counts[activeTab]} dịch vụ</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trước</Button><span className="min-w-20 text-center">Trang {page}/{totalPages}</span><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau</Button></div></div>}
          </>}
        </section>
      </div>
    </main>
  );
};

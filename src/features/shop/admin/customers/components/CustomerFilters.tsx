import { RotateCcw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CustomerRetentionFilter, CustomerSort } from "../types/customer";

interface CustomerFiltersProps {
  search: string;
  retention: CustomerRetentionFilter;
  sort: CustomerSort;
  hasUpcomingAppointment?: boolean;
  lastVisitBefore: string;
  onSearch: (value: string) => void;
  onRetention: (value: CustomerRetentionFilter) => void;
  onSort: (value: CustomerSort) => void;
  onUpcoming: (value: boolean | undefined) => void;
  onLastVisit: (value: string) => void;
  onReset: () => void;
}

export function CustomerFilters(props: CustomerFiltersProps) {
  const { t } = useTranslation("customers");
  const quickValue = props.sort === "SPEND_DESC" && props.retention === "ALL" ? "ALL" : props.sort === "VISITS_DESC" && props.retention === "ALL" ? "VISITS" : props.sort === "LONGEST_INACTIVE" && props.retention === "ALL" ? "LONGEST_INACTIVE" : "CUSTOM";
  const setQuick = (value: string) => {
    if (value === "ALL") { props.onRetention("ALL"); props.onSort("SPEND_DESC"); }
    if (value === "VISITS") { props.onRetention("ALL"); props.onSort("VISITS_DESC"); }
    if (value === "LONGEST_INACTIVE") { props.onRetention("ALL"); props.onSort("LONGEST_INACTIVE"); }
  };
  return (
    <section className="space-y-4" aria-label={t("filters.title")}>
      <Tabs value={quickValue} onValueChange={setQuick}>
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="ALL" className="min-h-11 shrink-0 sm:min-h-8">{t("segments.all")}</TabsTrigger>
          <TabsTrigger value="VISITS" className="min-h-11 shrink-0 sm:min-h-8">{t("segments.mostVisits")}</TabsTrigger>
          <TabsTrigger value="LONGEST_INACTIVE" className="min-h-11 shrink-0 sm:min-h-8">{t("segments.longestInactive")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-3 rounded-xl border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.5fr)_repeat(4,minmax(130px,1fr))_auto] lg:items-end">
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="customer-search">{t("filters.searchLabel")}</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="customer-search" value={props.search} onChange={(event) => props.onSearch(event.target.value)} placeholder={t("filters.searchPlaceholder")} className="h-11 pl-9" />
          </div>
        </div>
        <div className="space-y-1.5"><Label htmlFor="customer-retention">{t("filters.retention")}</Label><Select value={props.retention} onValueChange={(value) => props.onRetention(value as CustomerRetentionFilter)}><SelectTrigger id="customer-retention" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">{t("filters.all")}</SelectItem><SelectItem value="RETURNING">{t("segments.returning")}</SelectItem><SelectItem value="NEW">{t("segments.new")}</SelectItem></SelectContent></Select></div>
        <div className="space-y-1.5"><Label htmlFor="customer-upcoming">{t("filters.upcoming")}</Label><Select value={props.hasUpcomingAppointment === undefined ? "ALL" : props.hasUpcomingAppointment ? "YES" : "NO"} onValueChange={(value) => props.onUpcoming(value === "ALL" ? undefined : value === "YES")}><SelectTrigger id="customer-upcoming" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">{t("filters.all")}</SelectItem><SelectItem value="YES">{t("filters.upcomingYes")}</SelectItem><SelectItem value="NO">{t("filters.upcomingNo")}</SelectItem></SelectContent></Select></div>
        <div className="space-y-1.5"><Label htmlFor="customer-last-visit">{t("filters.lastVisitBefore")}</Label><Input id="customer-last-visit" type="date" value={props.lastVisitBefore} onChange={(event) => props.onLastVisit(event.target.value)} className="h-11" /></div>
        <div className="space-y-1.5"><Label htmlFor="customer-sort">{t("filters.sort")}</Label><Select value={props.sort} onValueChange={(value) => props.onSort(value as CustomerSort)}><SelectTrigger id="customer-sort" className="min-h-11"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="SPEND_DESC">{t("sort.spend")}</SelectItem><SelectItem value="VISITS_DESC">{t("sort.visits")}</SelectItem><SelectItem value="RECENT_VISIT">{t("sort.recent")}</SelectItem><SelectItem value="LONGEST_INACTIVE">{t("sort.longestInactive")}</SelectItem><SelectItem value="NEWEST">{t("sort.newest")}</SelectItem></SelectContent></Select></div>
        <Button type="button" variant="ghost" className="min-h-11 gap-2" onClick={props.onReset}><RotateCcw aria-hidden="true" />{t("filters.reset")}</Button>
      </div>
    </section>
  );
}

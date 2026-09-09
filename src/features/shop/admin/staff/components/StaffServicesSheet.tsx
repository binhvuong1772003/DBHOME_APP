import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Scissors, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAsync } from "@/hooks/common/useAsync";
import { useAsyncAction } from "@/hooks/common/useAsyncAction";
import { getListService } from "@/services/serviceService";
import {
  getStaffServices,
  updateStaffServices,
} from "../services/staffService";
import { getStaffInitials, getStaffName } from "../constants/staff";
import type { Staff, StaffServiceAssignment } from "../types/staff";
import type { Service } from "@/types/service";

interface StaffServicesSheetProps {
  staff: Staff | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffServicesSheet({
  staff,
  open,
  onOpenChange,
}: StaffServicesSheetProps) {
  const { t, i18n } = useTranslation("staff");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const { isLoading, error, run } = useAsync();
  const { isLoading: isSaving, run: runAction } = useAsyncAction();
  const staffName = staff ? getStaffName(staff) : "";
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  const load = useCallback(async () => {
    if (!shopSlug || !staff) return;
    await run(async () => {
      const [assigned, serviceResult] = await Promise.all([
        getStaffServices(shopSlug, staff.id),
        getListService(shopSlug, { page: 1, limit: 50, status: "ACTIVE", sort: "NAME_ASC" }),
      ]);
      setSelectedIds(assigned.filter((item: StaffServiceAssignment) => item.isActive).map((item) => item.serviceId));
      setServices(serviceResult.items);
    }, t("services.loadError"));
  }, [run, shopSlug, staff, t]);

  useEffect(() => {
    if (!open || !staff) return;
    void load();
  }, [load, open, staff]);

  const visibleServices = useMemo(() => {
    const term = search.trim().toLocaleLowerCase(locale);
    if (!term) return services;
    return services.filter((service) => service.name.toLocaleLowerCase(locale).includes(term));
  }, [locale, search, services]);

  const toggleService = (serviceId: string, checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedIds((current) => current.includes(serviceId) ? current : [...current, serviceId]);
    } else {
      setSelectedIds((current) => current.filter((id) => id !== serviceId));
    }
  };

  const handleSave = async () => {
    if (!shopSlug || !staff || isSaving) return;
    const saved = await runAction(
      () => updateStaffServices(shopSlug, staff.id, selectedIds),
      { success: t("services.saveSuccess"), errorFallback: t("services.saveError") },
    );
    if (saved !== undefined) onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b px-6 py-5 pr-16">
          <SheetTitle>{t("services.title")}</SheetTitle>
          <SheetDescription>{t("services.description", { name: staffName })}</SheetDescription>
          {staff && (
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/35 p-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary">{getStaffInitials(staff)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{staffName}</p>
                <p className="text-xs text-muted-foreground">{t("services.selectedCount", { count: selectedIds.length })}</p>
              </div>
            </div>
          )}
        </SheetHeader>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 size-11 rounded-full sm:size-9"
          onClick={() => onOpenChange(false)}
          aria-label={t("services.close")}
        >
          <X aria-hidden="true" />
        </Button>

        <div className="flex min-h-0 flex-1 flex-col px-6 py-5">
          <Label htmlFor="staff-services-search" className="sr-only">{t("services.searchLabel")}</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="staff-services-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("services.searchPlaceholder")}
              className="h-11 pl-9"
            />
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
            {isLoading && (
              <div className="space-y-3" aria-busy="true" aria-label={t("services.loading")}>
                {[0, 1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-muted" />)}
              </div>
            )}
            {!isLoading && error && (
              <div role="alert" className="rounded-lg border border-destructive/25 bg-destructive/10 p-4 text-sm">
                <p className="font-medium">{t("services.loadError")}</p>
                <p className="mt-1 text-muted-foreground">{error}</p>
                <Button type="button" variant="outline" className="mt-4 min-h-11" onClick={() => void load()}>{t("services.retry")}</Button>
              </div>
            )}
            {!isLoading && !error && visibleServices.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed px-5 text-center">
                <Scissors className="size-6 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium">{t("services.emptyTitle")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("services.emptyDescription")}</p>
              </div>
            )}
            {!isLoading && !error && visibleServices.length > 0 && (
              <div className="space-y-2">
                {visibleServices.map((service) => {
                  const checked = selectedIds.includes(service.id);
                  return (
                    <label key={service.id} htmlFor={`staff-service-${service.id}`} className="flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/35 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                      <Checkbox id={`staff-service-${service.id}`} checked={checked} onCheckedChange={(value) => toggleService(service.id, value)} disabled={isSaving} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{service.name}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {service.basePrice != null ? new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(service.basePrice) : t("services.priceUnavailable")}
                          <span aria-hidden="true"> · </span>{t("services.duration", { minutes: service.durationMin })}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t bg-background px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)} disabled={isSaving}>{t("services.cancel")}</Button>
          <Button type="button" className="min-h-11" onClick={() => void handleSave()} disabled={isLoading || Boolean(error) || isSaving || !staff}>
            {isSaving ? t("services.saving") : t("services.save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

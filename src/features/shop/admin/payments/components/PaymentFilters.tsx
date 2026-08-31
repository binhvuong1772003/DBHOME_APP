import type { FormEvent } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PaymentDatePreset, PaymentFilters as PaymentFiltersValue, PaymentMethod, PaymentStatus } from "../types/payment";

const statuses: PaymentStatus[] = ["PAID", "PENDING", "PARTIAL", "REFUNDED"];
const methods: PaymentMethod[] = ["CASH", "CARD", "TRANSFER", "MOMO", "VNPAY", "ZALO_PAY"];
const presets: PaymentDatePreset[] = ["TODAY", "THIS_WEEK", "THIS_MONTH", "PREVIOUS_MONTH", "CUSTOM"];

interface Props {
  draft: PaymentFiltersValue;
  preset: PaymentDatePreset;
  rangeError: string | null;
  isLoading: boolean;
  onDraftChange: (filters: PaymentFiltersValue) => void;
  onPresetChange: (preset: PaymentDatePreset) => void;
  onApply: () => void;
  onClear: () => void;
}

export function PaymentFilters({ draft, preset, rangeError, isLoading, onDraftChange, onPresetChange, onApply, onClear }: Props) {
  const { t } = useTranslation("payments");
  const submit = (event: FormEvent) => { event.preventDefault(); onApply(); };

  return (
    <Card className="gap-0 py-4 shadow-sm">
      <CardContent className="px-4">
        <form className="space-y-3" onSubmit={submit}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("filters.title")}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <Field label={t("filters.period")}>
              <Select value={preset} onValueChange={(value) => onPresetChange(value as PaymentDatePreset)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {presets.map((value) => <SelectItem key={value} value={value}>{t(`filters.${presetKey(value)}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("filters.from")}>
              <Input type="date" value={draft.from} max={draft.to} onChange={(event) => { onPresetChange("CUSTOM"); onDraftChange({ ...draft, from: event.target.value }); }} />
            </Field>
            <Field label={t("filters.to")}>
              <Input type="date" value={draft.to} min={draft.from} onChange={(event) => { onPresetChange("CUSTOM"); onDraftChange({ ...draft, to: event.target.value }); }} />
            </Field>
            <Field label={t("filters.status")}>
              <Select value={draft.status ?? "ALL"} onValueChange={(value) => onDraftChange({ ...draft, status: value === "ALL" ? undefined : value as PaymentStatus })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("filters.allStatuses")}</SelectItem>
                  {statuses.map((value) => <SelectItem key={value} value={value}>{t(`statuses.${value.toLowerCase()}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("filters.method")}>
              <Select value={draft.method ?? "ALL"} onValueChange={(value) => onDraftChange({ ...draft, method: value === "ALL" ? undefined : value as PaymentMethod })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("filters.allMethods")}</SelectItem>
                  {methods.map((value) => <SelectItem key={value} value={value}>{t(`methods.${value.toLowerCase()}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field className="sm:col-span-2" label={t("filters.search")}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input className="pl-9" value={draft.search ?? ""} placeholder={t("filters.searchPlaceholder")} onChange={(event) => onDraftChange({ ...draft, search: event.target.value })} />
              </div>
            </Field>
          </div>
          {rangeError ? <p className="text-sm text-destructive" role="alert">{t("filters.invalidRange")}</p> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClear} disabled={isLoading}>
              <X aria-hidden="true" />{t("filters.clear")}
            </Button>
            <Button type="submit" disabled={isLoading}>{t("filters.apply")}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return <div className={className}><Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>{children}</div>;
}

function presetKey(value: PaymentDatePreset) {
  return ({ TODAY: "today", THIS_WEEK: "thisWeek", THIS_MONTH: "thisMonth", PREVIOUS_MONTH: "previousMonth", CUSTOM: "custom" } as const)[value];
}

import { useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getStaffName } from "../../staff/constants/staff";
import type { Staff } from "../../staff/types/staff";
import { getListService } from "@/services/serviceService";
import { getCommissions, getSalaryConfig, updateCommission, updateSalaryConfig } from "../services/payrollService";
import type { CommissionType, SalaryConfigInput, SalaryPeriod, ServiceCommission } from "../types/payroll";
import { getApiError } from "../utils/payroll";

const defaults = (): SalaryConfigInput => ({
  commissionType: "PERCENT", baseSalary: 0, salaryPeriod: "MONTHLY",
  defaultCommissionPercent: 0, defaultFixedPerService: 0,
  bonusPerPositiveReview: 0, penaltyPerNoShow: 0,
  penaltyPerLateMinute: 0, otMultiplier: 1.5,
  effectiveFrom: new Date().toISOString().slice(0, 10), note: "",
});

interface SalaryConfigSheetProps {
  open: boolean;
  shopSlug: string;
  staff: Staff[];
  onOpenChange: (open: boolean) => void;
}

export function SalaryConfigSheet({ open, shopSlug, staff, onOpenChange }: SalaryConfigSheetProps) {
  const { t, i18n } = useTranslation("payroll");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const [staffId, setStaffId] = useState("");
  const [config, setConfig] = useState<SalaryConfigInput>(defaults);
  const [commissions, setCommissions] = useState<ServiceCommission[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !staffId) { setConfig(defaults()); setCommissions([]); return; }
    let active = true; setLoading(true);
    Promise.all([getSalaryConfig(shopSlug, staffId), getCommissions(shopSlug, staffId), getListService(shopSlug, { page: 1, limit: 100, status: "ACTIVE", sort: "NAME_ASC" })])
      .then(([value, overrides, services]) => {
        if (!active) return;
        const nextConfig = value ? { ...value, effectiveFrom: value.effectiveFrom.slice(0, 10) } : defaults();
        setConfig(nextConfig);
        setCommissions(services.items.map((service) => {
          const override = overrides.find((item) => item.serviceId === service.id);
          return override ?? {
            id: service.id,
            serviceId: service.id,
            commissionType: nextConfig.commissionType === "FIXED_PER_SERVICE" ? "FIXED_PER_SERVICE" : "PERCENT",
            value: nextConfig.commissionType === "FIXED_PER_SERVICE" ? Number(nextConfig.defaultFixedPerService ?? 0) : Number(nextConfig.defaultCommissionPercent ?? 0),
            service: { id: service.id, name: service.name, price: service.basePrice },
          };
        }));
      })
      .catch((error) => { if (active) toast.error(t("errors.action"), { description: getApiError(error) }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, shopSlug, staffId, t]);

  const setNumber = (key: keyof SalaryConfigInput, value: string) => setConfig((current) => ({ ...current, [key]: value === "" ? 0 : Number(value) }));
  const saveConfig = async () => {
    if (!staffId) return; setSaving(true);
    try {
      const saved = await updateSalaryConfig(shopSlug, staffId, config);
      setConfig({ ...saved, effectiveFrom: saved.effectiveFrom.slice(0, 10) });
      toast.success(t("config.saved"));
    } catch (error) { toast.error(t("errors.action"), { description: getApiError(error) }); }
    finally { setSaving(false); }
  };
  const saveCommission = async (item: ServiceCommission) => {
    setSaving(true);
    try {
      const saved = await updateCommission(shopSlug, staffId, item.serviceId, { commissionType: item.commissionType, value: Number(item.value) });
      setCommissions((current) => current.map((value) => value.serviceId === item.serviceId ? { ...value, ...saved } : value));
      toast.success(t("commissions.saved"));
    } catch (error) { toast.error(t("errors.action"), { description: getApiError(error) }); }
    finally { setSaving(false); }
  };
  const numeric: [keyof SalaryConfigInput, string][] = [["baseSalary","baseSalary"],["defaultCommissionPercent","defaultPercent"],["defaultFixedPerService","defaultFixed"],["bonusPerPositiveReview","reviewBonus"],["penaltyPerNoShow","noShowPenalty"],["penaltyPerLateMinute","latePenalty"],["otMultiplier","otMultiplier"]];

  return <Sheet open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) setStaffId(""); }}><SheetContent className="w-full overflow-y-auto sm:max-w-3xl"><SheetHeader><SheetTitle>{t("config.title")}</SheetTitle><SheetDescription>{t("config.description")}</SheetDescription></SheetHeader><div className="space-y-6 px-4 pb-6">
    <div className="space-y-1.5"><Label>{t("staff")}</Label><Select value={staffId} onValueChange={setStaffId}><SelectTrigger className="min-h-11"><SelectValue placeholder={t("config.selectStaff")} /></SelectTrigger><SelectContent>{staff.map((item) => <SelectItem key={item.id} value={item.id}>{getStaffName(item)}</SelectItem>)}</SelectContent></Select></div>
    {!staffId && <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed text-center"><Settings2 className="size-9 text-muted-foreground" aria-hidden="true" /><p className="mt-3 font-semibold">{t("config.selectStaff")}</p><p className="mt-1 text-sm text-muted-foreground">{t("config.selectStaffDescription")}</p></div>}
    {staffId && loading && <div className="space-y-3">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-12" />)}</div>}
    {staffId && !loading && <><section><h3 className="font-semibold">{t("config.payRules")}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label>{t("config.commissionType")}</Label><Select value={String(config.commissionType ?? "PERCENT")} onValueChange={(value) => setConfig((current) => ({ ...current, commissionType: value as CommissionType }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(["PERCENT","FIXED_PER_SERVICE","FIXED_PER_DAY","SALARY"] as CommissionType[]).map((value) => <SelectItem key={value} value={value}>{t(`config.commissionTypes.${value.toLowerCase()}`)}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>{t("config.salaryPeriod")}</Label><Select value={String(config.salaryPeriod ?? "MONTHLY")} onValueChange={(value) => setConfig((current) => ({ ...current, salaryPeriod: value as SalaryPeriod }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(["WEEKLY","BIWEEKLY","MONTHLY"] as SalaryPeriod[]).map((value) => <SelectItem key={value} value={value}>{t(`config.periods.${value.toLowerCase()}`)}</SelectItem>)}</SelectContent></Select></div>{numeric.map(([key, label]) => <div key={key} className="space-y-1.5"><Label htmlFor={`salary-${key}`}>{t(`config.${label}`)}</Label><Input id={`salary-${key}`} type="number" min="0" inputMode="decimal" step={key === "otMultiplier" ? ".1" : "1"} value={Number(config[key] ?? 0)} onChange={(event) => setNumber(key, event.target.value)} /></div>)}<div className="space-y-1.5"><Label htmlFor="salary-effective">{t("config.effectiveFrom")}</Label><Input id="salary-effective" type="date" value={String(config.effectiveFrom ?? "")} onChange={(event) => setConfig((current) => ({ ...current, effectiveFrom: event.target.value }))} /></div><div className="space-y-1.5 sm:col-span-2"><Label htmlFor="salary-note">{t("config.note")}</Label><Textarea id="salary-note" value={String(config.note ?? "")} onChange={(event) => setConfig((current) => ({ ...current, note: event.target.value }))} /></div><Button className="min-h-11 sm:col-span-2" disabled={saving} onClick={() => void saveConfig()}>{saving ? t("config.saving") : t("config.save")}</Button></div></section>
      <section className="border-t pt-5"><h3 className="font-semibold">{t("commissions.title")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("commissions.description")}</p>{commissions.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">{t("commissions.empty")}</p> : <div className="mt-3 divide-y">{commissions.map((item) => <div key={item.serviceId} className="space-y-3 py-4"><p className="font-medium">{item.service.name}</p><div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><div className="space-y-1.5"><Label>{t("commissions.type")}</Label><Select value={item.commissionType} onValueChange={(value) => setCommissions((current) => current.map((entry) => entry.serviceId === item.serviceId ? { ...entry, commissionType: value as ServiceCommission["commissionType"] } : entry))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PERCENT">%</SelectItem><SelectItem value="FIXED_PER_SERVICE">{new Intl.NumberFormat(locale).format(0)} VND</SelectItem></SelectContent></Select></div><div className="space-y-1.5"><Label htmlFor={`service-commission-${item.serviceId}`}>{t("commissions.value")}</Label><Input id={`service-commission-${item.serviceId}`} type="number" min="0" inputMode="decimal" value={item.value} onChange={(event) => setCommissions((current) => current.map((entry) => entry.serviceId === item.serviceId ? { ...entry, value: Number(event.target.value) } : entry))} /></div><Button variant="outline" className="min-h-11" disabled={saving} onClick={() => void saveCommission(item)}>{t("commissions.save")}</Button></div></div>)}</div>}</section>
    </>}
  </div></SheetContent></Sheet>;
}

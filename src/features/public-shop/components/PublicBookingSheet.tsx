import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarDays, Check, Clock3, Loader2, Scissors, UserRound, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { createPublicShopBooking, getPublicShopAvailability } from "../services/publicShopService";
import type { PublicBookingInput, PublicBookingResult, PublicShopPage, PublicShopService } from "../types";

export interface PublicBookingDraft {
  shopSlug: string;
  serviceIds: string[];
  staffId?: string;
  date: string;
  startTime?: string;
  serviceOptions?: { serviceId: string; optionValueIds: string[] }[];
}

interface PublicBookingSheetProps {
  shop: PublicShopPage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceId?: string;
  restoredDraft?: PublicBookingDraft | null;
  onRequireAuth: (draft: PublicBookingDraft) => void;
}

const getToday = (timeZone?: string) => new Intl.DateTimeFormat("en-CA", timeZone ? { timeZone } : undefined).format(new Date());

const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "SHN";

export function PublicBookingSheet({ shop, open, onOpenChange, initialServiceId, restoredDraft, onRequireAuth }: PublicBookingSheetProps) {
  const { t, i18n } = useTranslation("publicShop");
  const { user } = useAuth();
  const navigate = useNavigate();
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [staffId, setStaffId] = useState("any");
  const [date, setDate] = useState(() => getToday(shop.timezone));
  const [startTime, setStartTime] = useState("");
  const [optionSelections, setOptionSelections] = useState<Record<string, Record<string, string>>>({});
  const [availability, setAvailability] = useState<{ availableSlots: string[]; message?: string } | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<PublicBookingResult | null>(null);

  const selectedServices = useMemo(
    () => shop.services.filter((service) => selectedServiceIds.includes(service.id)),
    [selectedServiceIds, shop.services],
  );

  const missingOptions = useMemo(
    () => selectedServices.some((service) => service.options.some((option) => option.isRequired && !optionSelections[service.id]?.[option.id])),
    [optionSelections, selectedServices],
  );

  const durationMin = useMemo(
    () => selectedServices.reduce((total, service) => total + service.durationMin + service.options.reduce((sum, option) => sum + (Number(optionSelections[service.id]?.[option.id] ? option.values.find((value) => value.id === optionSelections[service.id]?.[option.id])?.duration ?? 0 : 0)), 0), 0),
    [optionSelections, selectedServices],
  );

  const totalPrice = useMemo(() => {
    const amount = selectedServices.reduce((total, service) => total + (service.basePrice ?? 0) + service.options.reduce((sum, option) => sum + (optionSelections[service.id]?.[option.id] ? option.values.find((value) => value.id === optionSelections[service.id]?.[option.id])?.price ?? 0 : 0), 0), 0);
    return selectedServices.every((service) => typeof service.basePrice === "number") ? amount : null;
  }, [optionSelections, selectedServices]);

  useEffect(() => {
    if (!open) return;
    const draft = restoredDraft;
    setSelectedServiceIds(draft?.shopSlug === shop.slug ? draft.serviceIds : initialServiceId ? [initialServiceId] : []);
    setStaffId(draft?.shopSlug === shop.slug ? draft.staffId ?? "any" : "any");
    setDate(draft?.shopSlug === shop.slug ? draft.date : getToday(shop.timezone));
    setStartTime(draft?.shopSlug === shop.slug ? draft.startTime ?? "" : "");
    setResult(null);
    setSubmitError("");
    if (draft?.shopSlug === shop.slug && draft.serviceOptions) {
      const restored: Record<string, Record<string, string>> = {};
      draft.serviceOptions.forEach((serviceOptions) => {
        restored[serviceOptions.serviceId] = {};
        const service = shop.services.find((item) => item.id === serviceOptions.serviceId);
        serviceOptions.optionValueIds.forEach((valueId) => {
          const option = service?.options.find((item) => item.values.some((value) => value.id === valueId));
          if (option) restored[serviceOptions.serviceId][option.id] = valueId;
        });
      });
      setOptionSelections(restored);
    } else {
      setOptionSelections({});
    }
  }, [initialServiceId, open, restoredDraft, shop.services, shop.slug, shop.timezone]);

  useEffect(() => {
    setStartTime("");
    setAvailability(null);
    setAvailabilityError("");
    if (!date || selectedServices.length === 0 || missingOptions || durationMin < 15) return;
    let cancelled = false;
    setAvailabilityLoading(true);
    void getPublicShopAvailability(shop.slug, { date, durationMin, ...(staffId !== "any" ? { staffId } : {}) })
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) setAvailabilityError(getApiErrorMessage(error, t("booking.availabilityError")));
      })
      .finally(() => {
        if (!cancelled) setAvailabilityLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, durationMin, missingOptions, selectedServices.length, shop.slug, staffId, t]);

  const toggleService = (service: PublicShopService) => {
    setSelectedServiceIds((current) => current.includes(service.id) ? current.filter((id) => id !== service.id) : [...current, service.id]);
  };

  const selectOption = (serviceId: string, optionId: string, valueId: string) => {
    setOptionSelections((current) => ({ ...current, [serviceId]: { ...current[serviceId], [optionId]: valueId } }));
  };

  const bookingInput = (): PublicBookingInput => ({
    date,
    startTime,
    ...(staffId !== "any" ? { staffId } : {}),
    serviceIds: selectedServiceIds,
    serviceOptions: selectedServices.flatMap((service) => {
      const values = service.options.map((option) => optionSelections[service.id]?.[option.id]).filter(Boolean) as string[];
      return values.length ? [{ serviceId: service.id, optionValueIds: values }] : [];
    }),
    source: "WEBSITE",
  });

  const handleSubmit = async () => {
    if (!user) {
      onRequireAuth({ shopSlug: shop.slug, serviceIds: selectedServiceIds, staffId: staffId !== "any" ? staffId : undefined, date, startTime, serviceOptions: bookingInput().serviceOptions });
      return;
    }
    if (!startTime || selectedServiceIds.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      setResult(await createPublicShopBooking(shop.slug, bookingInput()));
    } catch (error: unknown) {
      setSubmitError(getApiErrorMessage(error, t("booking.submitError")));
    } finally {
      setSubmitting(false);
    }
  };

  const money = (value: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border/70 px-5 py-5 text-left sm:px-7">
          <div className="flex items-start justify-between gap-4"><div><SheetTitle className="text-xl">{t("booking.title")}</SheetTitle><SheetDescription className="mt-1">{shop.name} · {t("booking.description")}</SheetDescription></div><SheetClose asChild><Button variant="ghost" size="icon" className="min-h-11 min-w-11" aria-label={t("booking.close")}><X aria-hidden="true" /></Button></SheetClose></div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {result ? <Card className="border-primary/30 bg-primary/5"><CardContent className="space-y-5 p-6 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check aria-hidden="true" /></div><div><h2 className="text-xl font-semibold">{t("booking.successTitle")}</h2><p className="mt-2 text-sm text-muted-foreground">{t("booking.successDescription")}</p></div><div className="rounded-lg border border-border bg-background p-4 text-left text-sm"><p><span className="text-muted-foreground">{t("booking.reference")}</span> <strong className="font-medium">#{result.id.slice(-8).toUpperCase()}</strong></p><p className="mt-2"><span className="text-muted-foreground">{t("booking.status")}</span> <strong className="font-medium">{t(`booking.statuses.${result.status}`, { defaultValue: result.status })}</strong></p><p className="mt-2"><span className="text-muted-foreground">{t("booking.when")}</span> <strong className="font-medium">{date} · {startTime}</strong></p></div><Button type="button" className="min-h-11 w-full" onClick={() => onOpenChange(false)}>{t("booking.done")}</Button></CardContent></Card> : <div className="space-y-6">
            <section aria-labelledby="booking-services-heading"><div className="flex items-center gap-2"><Scissors className="size-4 text-primary" aria-hidden="true" /><h2 id="booking-services-heading" className="font-semibold">{t("booking.chooseServices")}</h2></div><div className="mt-3 space-y-3">{shop.services.map((service) => { const selected = selectedServiceIds.includes(service.id); return <Card key={service.id} className={selected ? "border-primary/50 bg-primary/5" : "border-border"}><CardContent className="p-4"><button type="button" onClick={() => toggleService(service)} className="flex min-h-11 w-full items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{selected && <Check className="size-3.5" aria-hidden="true" />}</span><span className="min-w-0 flex-1"><span className="block font-medium">{service.name}</span><span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" />{service.durationMin} {t("services.minutes")}</span>{typeof service.basePrice === "number" && <span>{money(service.basePrice)}</span>}</span></span></button>{selected && service.options.length > 0 && <div className="mt-4 space-y-3 border-t border-border/70 pt-4">{service.options.map((option) => <div key={option.id}><label htmlFor={`public-option-${option.id}`} className="mb-1.5 block text-sm font-medium">{option.name}{option.isRequired && <span className="text-destructive"> *</span>}</label><Select value={optionSelections[service.id]?.[option.id] ?? ""} onValueChange={(value) => selectOption(service.id, option.id, value)}><SelectTrigger id={`public-option-${option.id}`} className="h-11 w-full"><SelectValue placeholder={t("booking.chooseOption")} /></SelectTrigger><SelectContent>{option.values.map((value) => <SelectItem key={value.id} value={value.id}>{value.name} · {money(value.price)}</SelectItem>)}</SelectContent></Select></div>)}</div>}</CardContent></Card>; })}</div></section>
            <section aria-labelledby="booking-time-heading"><div className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" aria-hidden="true" /><h2 id="booking-time-heading" className="font-semibold">{t("booking.chooseTime")}</h2></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><div><label htmlFor="public-booking-date" className="mb-1.5 block text-sm font-medium">{t("booking.date")}</label><Input id="public-booking-date" type="date" min={getToday(shop.timezone)} value={date} onChange={(event) => setDate(event.target.value)} className="h-11" /></div>{shop.staffMembers.length > 0 && <div><label htmlFor="public-booking-staff" className="mb-1.5 block text-sm font-medium">{t("booking.staff")}</label><Select value={staffId} onValueChange={setStaffId}><SelectTrigger id="public-booking-staff" className="h-11 w-full"><UserRound className="size-4" aria-hidden="true" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">{t("booking.anyStaff")}</SelectItem>{shop.staffMembers.map((staff) => <SelectItem key={staff.id} value={staff.id}>{staff.nickname || staff.user.name}</SelectItem>)}</SelectContent></Select></div>}</div>{missingOptions && <p className="mt-3 text-sm text-muted-foreground">{t("booking.requiredOptions")}</p>}{availabilityError && <Alert variant="destructive" className="mt-3"><AlertCircle className="size-4" aria-hidden="true" /><AlertDescription>{availabilityError}</AlertDescription></Alert>}{availabilityLoading && <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden="true" />{t("booking.loadingSlots")}</div>}{!availabilityLoading && availability && <div className="mt-4">{availability.availableSlots.length > 0 ? <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{availability.availableSlots.map((slot) => <Button key={slot} type="button" variant={startTime === slot ? "default" : "outline"} className="min-h-11" onClick={() => setStartTime(slot)}>{slot}</Button>)}</div> : <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">{availability.message || t("booking.noSlots")}</p>}</div>}</section>
            <section aria-labelledby="booking-confirm-heading"><div className="flex items-center gap-2"><Check className="size-4 text-primary" aria-hidden="true" /><h2 id="booking-confirm-heading" className="font-semibold">{t("booking.confirm")}</h2></div><Card className="mt-3 bg-muted/40"><CardContent className="space-y-3 p-4 text-sm"><div className="flex items-start justify-between gap-4"><span className="text-muted-foreground">{t("booking.selectedServices")}</span><span className="text-right font-medium">{selectedServices.length ? selectedServices.map((service) => service.name).join(", ") : t("booking.noneSelected")}</span></div><div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{t("booking.duration")}</span><span className="font-medium">{durationMin || "—"} {durationMin ? t("services.minutes") : ""}</span></div>{totalPrice !== null && <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3"><span className="text-muted-foreground">{t("booking.estimatedTotal")}</span><span className="font-semibold">{money(totalPrice)}</span></div>}</CardContent></Card>{submitError && <Alert variant="destructive" className="mt-3"><AlertCircle className="size-4" aria-hidden="true" /><AlertDescription>{submitError}</AlertDescription></Alert>}{!user ? <div className="mt-4 rounded-lg border border-border p-4"><p className="text-sm text-muted-foreground">{t("booking.signInRequired")}</p><Button type="button" className="mt-3 min-h-11 w-full" disabled={!startTime || selectedServices.length === 0 || missingOptions} onClick={() => onRequireAuth({ shopSlug: shop.slug, serviceIds: selectedServiceIds, staffId: staffId !== "any" ? staffId : undefined, date, startTime, serviceOptions: bookingInput().serviceOptions })}>{t("booking.signInToContinue")}</Button></div> : <div className="mt-4 flex items-center gap-3 rounded-lg border border-border p-4"><Avatar className="size-9"><AvatarImage src={user.avatarUrl} alt={user.name} /><AvatarFallback>{initials(user.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div></div>}</section>
            {user && <Button type="button" className="min-h-12 w-full" disabled={submitting || !startTime || selectedServices.length === 0 || missingOptions} onClick={() => void handleSubmit()}>{submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}{submitting ? t("booking.submitting") : t("booking.confirmButton")}</Button>}
            {!user && <Button type="button" variant="link" className="w-full" onClick={() => navigate(`/auth?mode=signin`)}>{t("booking.alreadyHaveAccount")}</Button>}
          </div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}

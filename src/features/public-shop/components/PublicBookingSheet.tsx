import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  Plus,
  Scissors,
  Trash2,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/common/Navbar";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createPublicShopBooking,
  getPublicShopAvailability,
} from "../services/publicShopService";
import type {
  PublicBookingDraft,
  PublicBookingInput,
  PublicBookingResult,
  PublicShopPage,
  PublicShopService,
} from "../types";

export type { PublicBookingDraft } from "../types";

interface PublicBookingSheetProps {
  shop: PublicShopPage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialServiceId?: string;
  restoredDraft?: PublicBookingDraft | null;
  onRequireAuth: (draft: PublicBookingDraft) => void;
}

const getToday = (timeZone?: string) =>
  new Intl.DateTimeFormat("en-CA", timeZone ? { timeZone } : undefined).format(
    new Date(),
  );

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "SHN";

export function PublicBookingSheet({
  shop,
  open,
  onOpenChange,
  initialServiceId,
  restoredDraft,
  onRequireAuth,
}: PublicBookingSheetProps) {
  const { t, i18n } = useTranslation("publicShop");
  const { user } = useAuth();
  const navigate = useNavigate();
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [staffId, setStaffId] = useState(() =>
    shop.staffMembers.length > 0 ? "" : "any",
  );
  const [date, setDate] = useState(() => getToday(shop.timezone));
  const [startTime, setStartTime] = useState("");
  const [optionSelections, setOptionSelections] = useState<
    Record<string, Record<string, string>>
  >({});
  const [optionDialogServiceId, setOptionDialogServiceId] = useState<
    string | null
  >(null);
  const [pendingOptionSelections, setPendingOptionSelections] = useState<
    Record<string, string>
  >({});
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("all");
  const [availability, setAvailability] = useState<{
    availableSlots: string[];
    message?: string;
  } | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<PublicBookingResult | null>(null);

  const selectedServices = useMemo(
    () =>
      shop.services.filter((service) =>
        selectedServiceIds.includes(service.id),
      ),
    [selectedServiceIds, shop.services],
  );

  const serviceGroups = useMemo(() => {
    const groups = new Map<
      string,
      { label: string; services: PublicShopService[] }
    >();
    shop.services.forEach((service) => {
      const label =
        service.category?.name?.trim() || t("services.categoryFallback");
      const key = service.category?.id ?? "uncategorized";
      const group = groups.get(key) ?? { label, services: [] };
      group.services.push(service);
      groups.set(key, group);
    });
    return Array.from(groups.entries()).map(([key, group]) => ({
      key,
      ...group,
    }));
  }, [shop.services, t]);

  const activeServiceCategory =
    selectedServiceCategory === "all" ||
    serviceGroups.some((group) => group.key === selectedServiceCategory)
      ? selectedServiceCategory
      : "all";
  const visibleBookingServices =
    activeServiceCategory === "all"
      ? shop.services
      : (serviceGroups.find((group) => group.key === activeServiceCategory)
          ?.services ?? []);

  const optionDialogService = useMemo(
    () =>
      shop.services.find((service) => service.id === optionDialogServiceId) ??
      null,
    [optionDialogServiceId, shop.services],
  );

  const missingOptions = useMemo(
    () =>
      selectedServices.some((service) =>
        service.options.some(
          (option) =>
            option.isRequired && !optionSelections[service.id]?.[option.id],
        ),
      ),
    [optionSelections, selectedServices],
  );

  const optionDialogMissingRequired = useMemo(
    () =>
      optionDialogService?.options.some(
        (option) => option.isRequired && !pendingOptionSelections[option.id],
      ) ?? false,
    [optionDialogService, pendingOptionSelections],
  );

  const durationMin = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) =>
          total +
          service.durationMin +
          service.options.reduce((sum, option) => {
            const valueId = optionSelections[service.id]?.[option.id];
            return (
              sum +
              (option.values.find((value) => value.id === valueId)?.duration ??
                0)
            );
          }, 0),
        0,
      ),
    [optionSelections, selectedServices],
  );

  const totalPrice = useMemo(() => {
    const amount = selectedServices.reduce(
      (total, service) =>
        total +
        (service.basePrice ?? 0) +
        service.options.reduce((sum, option) => {
          const valueId = optionSelections[service.id]?.[option.id];
          return (
            sum +
            (option.values.find((value) => value.id === valueId)?.price ?? 0)
          );
        }, 0),
      0,
    );
    return selectedServices.every(
      (service) => typeof service.basePrice === "number",
    )
      ? amount
      : null;
  }, [optionSelections, selectedServices]);

  useEffect(() => {
    if (!open) return;

    const draft = restoredDraft?.shopSlug === shop.slug ? restoredDraft : null;
    const initialService = initialServiceId
      ? shop.services.find((service) => service.id === initialServiceId)
      : undefined;

    setSelectedServiceIds(
      draft?.serviceIds ??
        (initialService && initialService.options.length === 0
          ? [initialService.id]
          : []),
    );
    setStaffId(draft?.staffId ?? (shop.staffMembers.length > 0 ? "" : "any"));
    setDate(draft?.date ?? getToday(shop.timezone));
    setStartTime(draft?.startTime ?? "");
    setSelectedServiceCategory("all");
    setResult(null);
    setSubmitError("");

    if (draft?.serviceOptions) {
      const restored: Record<string, Record<string, string>> = {};
      draft.serviceOptions.forEach((serviceOptions) => {
        restored[serviceOptions.serviceId] = {};
        const service = shop.services.find(
          (item) => item.id === serviceOptions.serviceId,
        );
        serviceOptions.optionValueIds.forEach((valueId) => {
          const option = service?.options.find((item) =>
            item.values.some((value) => value.id === valueId),
          );
          if (option) restored[serviceOptions.serviceId][option.id] = valueId;
        });
      });
      setOptionSelections(restored);
    } else {
      setOptionSelections({});
    }

    if (!draft && initialService?.options.length) {
      setOptionDialogServiceId(initialService.id);
      setPendingOptionSelections({});
    } else {
      setOptionDialogServiceId(null);
      setPendingOptionSelections({});
    }
  }, [
    initialServiceId,
    open,
    restoredDraft,
    shop.services,
    shop.slug,
    shop.staffMembers.length,
    shop.timezone,
  ]);

  useEffect(() => {
    setStartTime("");
    setAvailability(null);
    setAvailabilityError("");
    const staffRequired = shop.staffMembers.length > 0 && !staffId;
    if (
      !date ||
      selectedServices.length === 0 ||
      missingOptions ||
      durationMin < 15 ||
      staffRequired
    ) {
      return;
    }

    let cancelled = false;
    setAvailabilityLoading(true);
    void getPublicShopAvailability(shop.slug, {
      date,
      durationMin,
      ...(staffId !== "any" ? { staffId } : {}),
    })
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setAvailabilityError(
            getApiErrorMessage(error, t("booking.availabilityError")),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setAvailabilityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    date,
    durationMin,
    missingOptions,
    selectedServices.length,
    shop.slug,
    shop.staffMembers.length,
    staffId,
    t,
  ]);

  const money = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const selectService = (service: PublicShopService) => {
    if (service.options.length > 0) {
      setPendingOptionSelections(optionSelections[service.id] ?? {});
      setOptionDialogServiceId(service.id);
      return;
    }

    setSelectedServiceIds((current) =>
      current.includes(service.id)
        ? current.filter((id) => id !== service.id)
        : [...current, service.id],
    );
  };

  const removeService = (serviceId: string) => {
    setSelectedServiceIds((current) =>
      current.filter((id) => id !== serviceId),
    );
    setOptionSelections((current) => {
      const next = { ...current };
      delete next[serviceId];
      return next;
    });
  };

  const addOptionService = () => {
    if (!optionDialogService || optionDialogMissingRequired) return;

    const serviceId = optionDialogService.id;
    setOptionSelections((current) => ({
      ...current,
      [serviceId]: { ...pendingOptionSelections },
    }));
    setSelectedServiceIds((current) =>
      current.includes(serviceId) ? current : [...current, serviceId],
    );
    setOptionDialogServiceId(null);
    setPendingOptionSelections({});
  };

  const closeOptionDialog = () => {
    setOptionDialogServiceId(null);
    setPendingOptionSelections({});
  };

  const bookingInput = (): PublicBookingInput => ({
    date,
    startTime,
    ...(staffId !== "any" ? { staffId } : {}),
    serviceIds: selectedServiceIds,
    serviceOptions: selectedServices.flatMap((service) => {
      const values = service.options
        .map((option) => optionSelections[service.id]?.[option.id])
        .filter(Boolean) as string[];
      return values.length
        ? [{ serviceId: service.id, optionValueIds: values }]
        : [];
    }),
    source: "WEBSITE",
  });

  const currentDraft = (): PublicBookingDraft => ({
    shopSlug: shop.slug,
    serviceIds: selectedServiceIds,
    staffId: staffId !== "any" ? staffId : undefined,
    date,
    startTime,
    serviceOptions: bookingInput().serviceOptions,
  });

  const handleSubmit = async () => {
    if (!user) {
      onRequireAuth(currentDraft());
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

  if (!open) return null;

  return (
    <div className="min-h-dvh overflow-x-clip bg-background font-sans text-foreground motion-safe:animate-in motion-safe:slide-in-from-top-8 motion-safe:fade-in motion-safe:duration-500 motion-reduce:animate-none">
      <Navbar className="shn-home-nav" />
      <main className="mx-auto w-full max-w-[1360px] px-4 pb-10 sm:px-6 lg:px-8">
        <header className="border-b border-border/70 py-5 sm:py-7">
          <Button
            type="button"
            variant="ghost"
            className="min-h-11 gap-2 px-3 text-sm font-semibold"
            onClick={() => onOpenChange(false)}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            {t("booking.back")}
          </Button>
          <div className="mt-5 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              {shop.name}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("booking.title")}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              {shop.description || t("booking.description")}
            </p>
          </div>
        </header>

        {result ? (
          <Card className="mx-auto mt-8 max-w-2xl border-primary/30 bg-primary/5">
            <CardContent className="space-y-5 p-6 text-center sm:p-8">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {t("booking.successTitle")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("booking.successDescription")}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4 text-left text-sm">
                <p>
                  <span className="text-muted-foreground">
                    {t("booking.reference")}
                  </span>{" "}
                  <strong className="font-medium">
                    #{result.id.slice(-8).toUpperCase()}
                  </strong>
                </p>
                <p className="mt-2">
                  <span className="text-muted-foreground">
                    {t("booking.status")}
                  </span>{" "}
                  <strong className="font-medium">
                    {t(`booking.statuses.${result.status}`, {
                      defaultValue: result.status,
                    })}
                  </strong>
                </p>
                <p className="mt-2">
                  <span className="text-muted-foreground">
                    {t("booking.when")}
                  </span>{" "}
                  <strong className="font-medium">
                    {date} · {startTime}
                  </strong>
                </p>
              </div>
              <Button
                type="button"
                className="min-h-11 w-full"
                onClick={() => onOpenChange(false)}
              >
                {t("booking.done")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-7 pt-7 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,27rem)] lg:items-start lg:gap-10 lg:pt-9">
            <div className="min-w-0 space-y-7">
              <section aria-labelledby="booking-services-heading">
                <div className="flex items-center gap-2">
                  <Scissors
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                  <h2
                    id="booking-services-heading"
                    className="text-xl font-semibold"
                  >
                    {t("booking.chooseServices")}
                  </h2>
                </div>
                <div
                  className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="tablist"
                  aria-label={t("services.categories")}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeServiceCategory === "all"}
                    className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${activeServiceCategory === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                    onClick={() => setSelectedServiceCategory("all")}
                  >
                    {t("services.allCategories")}
                  </button>
                  {serviceGroups.map((group) => (
                    <button
                      key={group.key}
                      type="button"
                      role="tab"
                      aria-selected={activeServiceCategory === group.key}
                      className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${activeServiceCategory === group.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                      onClick={() => setSelectedServiceCategory(group.key)}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visibleBookingServices.map((service) => {
                    const selected = selectedServiceIds.includes(service.id);
                    return (
                      <Card
                        key={service.id}
                        className={
                          selected
                            ? "border-primary/50 bg-primary/5 shadow-sm"
                            : "border-border/80"
                        }
                      >
                        <CardContent className="flex h-full flex-col gap-4 p-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium leading-snug">
                              {service.name}
                            </h3>
                            {service.description && (
                              <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                                {service.description}
                              </p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Clock3
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                                {service.durationMin} {t("services.minutes")}
                              </span>
                              <span className="font-medium text-foreground">
                                {typeof service.basePrice === "number"
                                  ? money(service.basePrice)
                                  : t("services.priceOnRequest")}
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant={selected ? "secondary" : "outline"}
                            className="min-h-11 w-full justify-center"
                            aria-pressed={selected}
                            onClick={() => selectService(service)}
                          >
                            {selected ? (
                              <Check className="size-4" aria-hidden="true" />
                            ) : (
                              <Plus className="size-4" aria-hidden="true" />
                            )}
                            {selected
                              ? t("booking.added")
                              : t("booking.addService")}
                          </Button>
                          {service.options.length > 0 && (
                            <p className="-mt-2 text-xs text-muted-foreground">
                              {t("booking.chooseOption")}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <section aria-labelledby="booking-time-heading">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                  <h2
                    id="booking-time-heading"
                    className="text-xl font-semibold"
                  >
                    {t("booking.chooseTime")}
                  </h2>
                </div>
                <Card className="mt-4">
                  <CardContent className="space-y-5 p-4 sm:p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="public-booking-date"
                          className="mb-1.5 block text-sm font-medium"
                        >
                          {t("booking.date")}
                        </label>
                        <Input
                          id="public-booking-date"
                          type="date"
                          min={getToday(shop.timezone)}
                          value={date}
                          onChange={(event) => setDate(event.target.value)}
                          className="h-11"
                        />
                      </div>
                      {shop.staffMembers.length > 0 && (
                        <div>
                          <label
                            htmlFor="public-booking-staff"
                            className="mb-1.5 block text-sm font-medium"
                          >
                            {t("booking.staff")}
                          </label>
                          <Select value={staffId} onValueChange={setStaffId}>
                            <SelectTrigger
                              id="public-booking-staff"
                              className="h-11 w-full"
                            >
                              <UserRound
                                className="size-4"
                                aria-hidden="true"
                              />
                              <SelectValue
                                placeholder={t("booking.chooseStaff")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">
                                {t("booking.anyStaff")}
                              </SelectItem>
                              {shop.staffMembers.map((staff) => (
                                <SelectItem key={staff.id} value={staff.id}>
                                  {staff.nickname || staff.user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {missingOptions && (
                      <p className="text-sm text-muted-foreground">
                        {t("booking.requiredOptions")}
                      </p>
                    )}
                    {shop.staffMembers.length > 0 &&
                      selectedServices.length > 0 &&
                      !staffId && (
                        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                          <UserRound
                            className="size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>{t("booking.selectStaffFirst")}</span>
                        </div>
                      )}
                    {availabilityError && (
                      <Alert variant="destructive">
                        <AlertCircle className="size-4" aria-hidden="true" />
                        <AlertDescription>{availabilityError}</AlertDescription>
                      </Alert>
                    )}
                    {availabilityLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                        {t("booking.loadingSlots")}
                      </div>
                    )}
                    {!availabilityLoading && availability && (
                      <div>
                        {availability.availableSlots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {availability.availableSlots.map((slot) => (
                              <Button
                                key={slot}
                                type="button"
                                variant={
                                  startTime === slot ? "default" : "outline"
                                }
                                className="min-h-11"
                                onClick={() => setStartTime(slot)}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {availability.message || t("booking.noSlots")}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Card className="border-primary/25 shadow-[0_16px_36px_rgba(39,49,42,0.08)] ring-1 ring-primary/10">
                <CardHeader className="bg-accent/55 p-5 sm:p-6">
                  <CardTitle className="flex items-center gap-2 font-serif text-xl">
                    <Scissors
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                    {t("booking.preview")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("booking.selectedServices")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-5 sm:p-6">
                  {selectedServices.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">
                      {t("booking.noneSelected")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedServices.map((service) => {
                        const selectedOptions = service.options.flatMap(
                          (option) => {
                            const valueId =
                              optionSelections[service.id]?.[option.id];
                            const value = option.values.find(
                              (item) => item.id === valueId,
                            );
                            return value ? [{ option, value }] : [];
                          },
                        );
                        return (
                          <div
                            key={service.id}
                            className="rounded-xl border border-border/80 bg-background p-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium">{service.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {service.durationMin} {t("services.minutes")}
                                  {typeof service.basePrice === "number" &&
                                    ` · ${money(service.basePrice)}`}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="min-h-11 min-w-11 shrink-0 text-muted-foreground hover:text-destructive"
                                aria-label={t("booking.removeService", {
                                  service: service.name,
                                })}
                                onClick={() => removeService(service.id)}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </Button>
                            </div>
                            {selectedOptions.length > 0 && (
                              <div className="mt-3 border-t border-border/70 pt-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                                  {t("booking.options")}
                                </p>
                                <ul className="mt-2 space-y-1.5 text-sm">
                                  {selectedOptions.map(({ option, value }) => (
                                    <li
                                      key={option.id}
                                      className="flex items-start justify-between gap-3"
                                    >
                                      <span className="min-w-0 text-muted-foreground">
                                        {option.name}: {value.name}
                                      </span>
                                      {value.price > 0 && (
                                        <span className="shrink-0 font-medium">
                                          +{money(value.price)}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-3 border-t border-border/70 pt-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {t("booking.duration")}
                      </span>
                      <span className="font-medium">
                        {durationMin || "—"}
                        {durationMin ? ` ${t("services.minutes")}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {t("booking.estimatedTotal")}
                      </span>
                      <span className="font-semibold">
                        {totalPrice !== null
                          ? money(totalPrice)
                          : selectedServices.length > 0
                            ? t("services.priceOnRequest")
                            : "—"}
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" aria-hidden="true" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  {!user ? (
                    <div className="space-y-3 rounded-xl border border-border p-4">
                      <p className="text-sm leading-6 text-muted-foreground">
                        {t("booking.signInRequired")}
                      </p>
                      <Button
                        type="button"
                        className="min-h-11 w-full"
                        disabled={
                          !startTime ||
                          selectedServices.length === 0 ||
                          missingOptions
                        }
                        onClick={() => void handleSubmit()}
                      >
                        {t("booking.signInToContinue")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                        <Avatar className="size-9">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {t("booking.confirm")}
                          </p>
                          <p className="truncate text-sm font-medium">
                            {user.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="min-h-12 w-full"
                        disabled={
                          submitting ||
                          !startTime ||
                          selectedServices.length === 0 ||
                          missingOptions
                        }
                        onClick={() => void handleSubmit()}
                      >
                        {submitting ? (
                          <Loader2
                            className="size-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Check className="size-4" aria-hidden="true" />
                        )}
                        {submitting
                          ? t("booking.submitting")
                          : t("booking.confirmButton")}
                      </Button>
                    </div>
                  )}
                  {!user && (
                    <Button
                      type="button"
                      variant="link"
                      className="min-h-11 w-full"
                      onClick={() => navigate("/auth?mode=signin")}
                    >
                      {t("booking.alreadyHaveAccount")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </main>

      <Dialog
        open={Boolean(optionDialogService)}
        onOpenChange={(nextOpen: boolean) => {
          if (!nextOpen) closeOptionDialog();
        }}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
          {optionDialogService && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t("booking.addService")}: {optionDialogService.name}
                </DialogTitle>
                <DialogDescription>
                  {t("booking.chooseOption")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {optionDialogService.options.map((option) => (
                  <div key={option.id}>
                    <label
                      htmlFor={`public-option-dialog-${option.id}`}
                      className="mb-1.5 block text-sm font-medium"
                    >
                      {option.name}
                      {option.isRequired && (
                        <span className="text-destructive"> *</span>
                      )}
                    </label>
                    <Select
                      value={pendingOptionSelections[option.id] ?? ""}
                      onValueChange={(value) =>
                        setPendingOptionSelections((current) => ({
                          ...current,
                          [option.id]: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        id={`public-option-dialog-${option.id}`}
                        className="h-11 w-full"
                      >
                        <SelectValue placeholder={t("booking.chooseOption")} />
                      </SelectTrigger>
                      <SelectContent>
                        {option.values.map((value) => (
                          <SelectItem key={value.id} value={value.id}>
                            {value.name}
                            {value.price > 0 ? ` (+${money(value.price)})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={closeOptionDialog}
                >
                  {t("booking.close")}
                </Button>
                <Button
                  type="button"
                  className="min-h-11"
                  disabled={optionDialogMissingRequired}
                  onClick={addOptionService}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {t("booking.addService")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
